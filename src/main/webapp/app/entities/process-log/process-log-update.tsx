import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IFileContent } from 'app/shared/model/file-content.model';
import { getEntities as getFileContents } from 'app/entities/file-content/file-content.reducer';
import { getEntity, updateEntity, createEntity, reset } from './process-log.reducer';
import { IProcessLog } from 'app/shared/model/process-log.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IProcessLogUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProcessLogUpdate = (props: IProcessLogUpdateProps) => {
  const [fileDataContentId, setFileDataContentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { processLogEntity, fileContents, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/process-log');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getFileContents();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.processDate = convertDateTimeToServer(values.processDate);

    if (errors.length === 0) {
      const entity = {
        ...processLogEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jhipsterSampleApplicationApp.processLog.home.createOrEditLabel">
            <Translate contentKey="jhipsterSampleApplicationApp.processLog.home.createOrEditLabel">Create or edit a ProcessLog</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : processLogEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="process-log-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="process-log-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="fileNameLabel" for="process-log-fileName">
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileName">File Name</Translate>
                </Label>
                <AvField
                  id="process-log-fileName"
                  type="text"
                  name="fileName"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fileValueLabel" for="process-log-fileValue">
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileValue">File Value</Translate>
                </Label>
                <AvField id="process-log-fileValue" type="string" className="form-control" name="fileValue" />
              </AvGroup>
              <AvGroup>
                <Label id="processDateLabel" for="process-log-processDate">
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.processDate">Process Date</Translate>
                </Label>
                <AvInput
                  id="process-log-processDate"
                  type="datetime-local"
                  className="form-control"
                  name="processDate"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.processLogEntity.processDate)}
                />
              </AvGroup>
              <AvGroup>
                <Label for="process-log-fileDataContent">
                  <Translate contentKey="jhipsterSampleApplicationApp.processLog.fileDataContent">File Data Content</Translate>
                </Label>
                <AvInput id="process-log-fileDataContent" type="select" className="form-control" name="fileDataContent.id">
                  <option value="" key="0" />
                  {fileContents
                    ? fileContents.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/process-log" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  fileContents: storeState.fileContent.entities,
  processLogEntity: storeState.processLog.entity,
  loading: storeState.processLog.loading,
  updating: storeState.processLog.updating,
  updateSuccess: storeState.processLog.updateSuccess
});

const mapDispatchToProps = {
  getFileContents,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessLogUpdate);
