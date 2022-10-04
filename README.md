# Grafana GitlabCI pipelines datasource plugin

This plugin creates a datasource to gather GitlabCI pipeline status in Grafana.

I had problems with the existing GitlabCI Pipeline dashboards, they displayed too many branches for each project, required yet another thing to deploy, so I thought why not do it in Grafana. This is the second (well 3rd) iteration, the visualization is limited, you can create queries with a gitlab group and a branch name. 

## Configuration

[Create datasource](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-datasource/master/docs/grafana-gitlab-create-datasource.webm)


## Screenshots

![Datasource config](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-datasource/master/src/img/datasource-config.png)



## Code metrics

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=kalidasya_grafana-gitlab-pipeline-datasource&metric=code_smells)](https://sonarcloud.io/dashboard?id=kalidasya_grafana-gitlab-pipeline-datasource)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kalidasya_grafana-gitlab-pipeline-datasource&metric=alert_status)](https://sonarcloud.io/dashboard?id=kalidasya_grafana-gitlab-pipeline-datasource)
