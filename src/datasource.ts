import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from '@apollo/client';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  dateTime,
} from '@grafana/data';

import { GitlabPipelineQuery, GitlabPipelineDataSourceOptions } from './types';

export class GitlabPipelineDataSource extends DataSourceApi<GitlabPipelineQuery, GitlabPipelineDataSourceOptions> {
  url: string;
  client: ApolloClient<NormalizedCacheObject>;

  constructor(instanceSettings: DataSourceInstanceSettings<GitlabPipelineDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url || 'http://localhost:9099/';
    this.client = new ApolloClient({
      uri: this.url,
      cache: new InMemoryCache(),
    });
  }

  private queryBuilder(query: GitlabPipelineQuery, after?: string) {
    let afterStr = "";
    if (typeof after !== 'undefined') {
      afterStr = `, after: "${after}"`
    }
    return `${query.refId}: group(fullPath: "${query.groupName}") {
        projects (first: 100, search: "${query.projectFilter || ''}" ${afterStr}) {
          nodes { 
            webUrl
            fullPath
            pipelines(ref: "${query.branchName}", first: 1) {
              nodes {
                id
                status
                finishedAt
                startedAt
                updatedAt          
                stages {
                  nodes {
                    name
                    detailedStatus {
                      label
                      detailsPath
                    }
                  }
                }
              }
            }
          }
          pageInfo {
            endCursor
          }
        }
      }`;
  }

  async query(options: DataQueryRequest<GitlabPipelineQuery>): Promise<DataQueryResponse> {
    const queries = options.targets
        .filter((v) => !v.hide)
        .map(async (item) => {
          return this.doQuery(item).then(async (response) => {
            const ret: any = []
            let data = response
            ret.push(...this.filterPipelines(response.data[item.refId].projects.nodes))
            while (data.data[item.refId].projects.pageInfo.endCursor) {
              data = await this.doQuery(item, data.data[item.refId].projects.pageInfo.endCursor)
              if (data.data[item.refId].projects) {
                ret.push(...this.filterPipelines(data.data[item.refId].projects.nodes))
              }
            }
            const frame = this.createDataframe(item.refId)
            ret.forEach((project: any) => {
              const pipeline = project.pipelines.nodes[0];
              const id = pipeline.id.split('/').pop();
              frame.appendRow([
                project.fullPath,
                id,
                `${project.webUrl}/pipelines/${id}`,
                pipeline.status.toLocaleLowerCase(),
                pipeline.startedAt,
                pipeline.updatedAt,
                pipeline.finishedAt,
                pipeline.stages.nodes.map((stage: any) => {
                  // remove the duplicated group/project
                  const path = stage.detailedStatus.detailsPath.split('/').slice(3).join('/');
                  return [stage.name, stage.detailedStatus.label, `${project.webUrl}/${path}`];
                }),
              ]);
            });

            return frame;
          })
        })
    return Promise.all(queries).then((frames) => {
      return ({ data: frames } as DataQueryResponse)
    })
  }
  private createDataframe(refId: string) {
    return new MutableDataFrame({
      refId: refId,
      fields: [
        { name: 'Project', type: FieldType.string },
        { name: 'Id', type: FieldType.string },
        { name: 'Link', type: FieldType.string },
        { name: 'Status', type: FieldType.string },
        { name: 'FinishedAt', type: FieldType.time },
        { name: 'UpdatedAt', type: FieldType.time },
        { name: 'StarteddAt', type: FieldType.time },
        { name: 'Stages', type: FieldType.other },
      ],
    });
  }

  filterPipelines(response: any): any {
    return response.filter((v: any) => v.pipelines.nodes.length > 0)
        .sort(
            (
                {
                  pipelines: {
                    nodes: [current],
                  },
                }: any,
                {
                  pipelines: {
                    nodes: [next],
                  },
                }: any
            ) => {
              const [left, right] =
                  next.startedAt && current.startedAt
                      ? [current.startedAt, next.startedAt]
                      : [current.finishedAt, next.finishedAt];
              return dateTime(right).valueOf() - dateTime(left).valueOf();
            }
        )
  }

  private doQuery(query: GitlabPipelineQuery, after?: string) {
    return this.client
        .query({
          query: gql`
              query {
                ${this.queryBuilder(query, after)}
              }
            `,
          fetchPolicy: 'network-only',
        });
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return this.client
        .query({
          query: gql`
          query {
            currentUser {
              name
            }
          }
        `,
        })
        .then((res) => {
          if (res.data.length === 0) {
            throw new Error('Match not found.');
          }
          return res;
        });
  }
}

