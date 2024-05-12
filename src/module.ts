import { DataSourcePlugin } from '@grafana/data';
import { GitlabPipelineDataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { GitlabPipelineQuery, GitlabPipelineDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<
    GitlabPipelineDataSource,
    GitlabPipelineQuery,
    GitlabPipelineDataSourceOptions
>(GitlabPipelineDataSource)
    .setConfigEditor(ConfigEditor)
    .setQueryEditor(QueryEditor);
