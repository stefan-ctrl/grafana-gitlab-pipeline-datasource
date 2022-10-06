import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface GitlabPipelineQuery extends DataQuery {
  branchName: string;
  groupName: string;
  projectFilter?: string;
}

export const defaultQuery: Partial<GitlabPipelineQuery> = {
  branchName: 'main',
  groupName: '',
  projectFilter: '',
};

/**
 * These are options configured for each DataSource instance
 */
export interface GitlabPipelineDataSourceOptions extends DataSourceJsonData {
  url: string;
  // groupName: string;
}

export interface GitlabPipelineDataSourceSecureOptions extends DataSourceJsonData {
  privateToken: string;
}
