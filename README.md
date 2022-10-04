# Grafana GitlabCI pipelines datasource plugin

This plugin creates a datasource to gather GitlabCI pipeline status in Grafana.

I had problems with the existing GitlabCI Pipeline dashboards, they displayed too many branches for each project, required yet another thing to deploy, so I thought why not do it in Grafana. This is the second (well 3rd) iteration, the visualization is limited, you can create queries with a gitlab group and a branch name. 

## Configuration

[Create datasource](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/grafana-gitlab-create-datasource.webm)


## Screenshots

![Datasource config](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/datasource-config.png)
![Settings page](https://raw.githubusercontent.com/kalidasya/grafana-gitlab-pipeline-status-plugin/main/docs/img/screenshots/settings-page.png)



## Code metrics

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=kalidasya_grafana-gitlab-pipeline-status-plugin&metric=code_smells)](https://sonarcloud.io/dashboard?id=kalidasya_grafana-gitlab-pipeline-status-plugin)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kalidasya_grafana-gitlab-pipeline-status-plugin&metric=alert_status)](https://sonarcloud.io/dashboard?id=kalidasya_grafana-gitlab-pipeline-status-plugin)
