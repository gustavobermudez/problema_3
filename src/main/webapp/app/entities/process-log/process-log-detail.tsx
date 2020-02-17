import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './process-log.reducer';
import { IProcessLog } from 'app/shared/model/process-log.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProcessLogDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessLogDetail = (props: IProcessLogDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { processLogEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="jhipsterSampleApplicationApp.processLog.detail.title">ProcessLog</Translate> [<b>{processLogEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileName">
              <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{processLogEntity.fileName}</dd>
          <dt>
            <span id="fileValue">
              <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileValue">File Value</Translate>
            </span>
          </dt>
          <dd>{processLogEntity.fileValue}</dd>
          <dt>
            <span id="processDate">
              <Translate contentKey="jhipsterSampleApplicationApp.processLog.processDate">Process Date</Translate>
            </span>
          </dt>
          <dd>
            <TextFormat value={processLogEntity.processDate} type="date" format={APP_DATE_FORMAT} />
          </dd>
          <dt>
            <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileDataContent">File Data Content</Translate>
          </dt>
          <dd>{processLogEntity.fileDataContent ? processLogEntity.fileDataContent.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/process-log" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/process-log/${processLogEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ processLog }: IRootState) => ({
  processLogEntity: processLog.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessLogDetail);
