import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './process-log.reducer';
import { IProcessLog } from 'app/shared/model/process-log.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessLogProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const ProcessLog = (props: IProcessLogProps) => {
  useEffect(() => {
    props.getEntities();
  }, []);

  const { processLogList, match, loading } = props;
  return (
    <div>
      <h2 id="process-log-heading">
        <Translate contentKey="jhipsterSampleApplicationApp.processLog.home.title">Process Logs</Translate>
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp;
          <Translate contentKey="jhipsterSampleApplicationApp.processLog.home.createLabel">Create new Process Log</Translate>
        </Link>
      </h2>
      <div className="table-responsive">
        {processLogList && processLogList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileName">File Name</Translate>
                </th>
                <th>
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileValue">File Value</Translate>
                </th>
                <th>
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.processDate">Process Date</Translate>
                </th>
                <th>
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileDataContent">File Data Content</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {processLogList.map((processLog, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${processLog.id}`} color="link" size="sm">
                      {processLog.id}
                    </Button>
                  </td>
                  <td>{processLog.fileName}</td>
                  <td>{processLog.fileValue}</td>
                  <td>
                    <TextFormat type="date" value={processLog.processDate} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    {processLog.fileDataContent ? (
                      <Link to={`file-content/${processLog.fileDataContent.id}`}>{processLog.fileDataContent.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${processLog.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${processLog.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${processLog.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="jhipsterSampleApplicationApp.processLog.home.notFound">No Process Logs found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ processLog }: IRootState) => ({
  processLogList: processLog.entities,
  loading: processLog.loading
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessLog);
