import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, openFile, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProcessLog } from 'app/shared/model/process-log.model';
import { getEntities as getProcessLogs } from 'app/entities/process-log/process-log.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './file-content.reducer';
import { IFileContent } from 'app/shared/model/file-content.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IFileContentUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FileContentUpdate = (props: IFileContentUpdateProps) => {
  const [processLogId, setProcessLogId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { fileContentEntity, processLogs, loading, updating } = props;

  const { fileDataContent, fileDataContentContentType } = fileContentEntity;

  const handleClose = () => {
    props.history.push('/file-content');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProcessLogs();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...fileContentEntity,
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
          <h2 id="jhipsterSampleApplicationApp.fileContent.home.createOrEditLabel">
            <Translate contentKey="jhipsterSampleApplicationApp.fileContent.home.createOrEditLabel">Create or edit a FileContent</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : fileContentEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="file-content-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="file-content-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <AvGroup>
                  <Label id="fileDataContentLabel" for="fileDataContent">
                    <Translate contentKey="jhipsterSampleApplicationApp.fileContent.fileDataContent">File Data Content</Translate>
                  </Label>
                  <br />
                  {fileDataContent ? (
                    <div>
                      <a onClick={openFile(fileDataContentContentType, fileDataContent)}>
                        <Translate contentKey="entity.action.open">Open</Translate>
                      </a>
                      <br />
                      <Row>
                        <Col md="11">
                          <span>
                            {fileDataContentContentType}, {byteSize(fileDataContent)}
                          </span>
                        </Col>
                        <Col md="1">
                          <Button color="danger" onClick={clearBlob('fileDataContent')}>
                            <FontAwesomeIcon icon="times-circle" />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  <input id="file_fileDataContent" type="file" onChange={onBlobChange(false, 'fileDataContent')} />
                  <AvInput
                    type="hidden"
                    name="fileDataContent"
                    value={fileDataContent}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/file-content" replace color="info">
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
  processLogs: storeState.processLog.entities,
  fileContentEntity: storeState.fileContent.entity,
  loading: storeState.fileContent.loading,
  updating: storeState.fileContent.updating,
  updateSuccess: storeState.fileContent.updateSuccess
});

const mapDispatchToProps = {
  getProcessLogs,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FileContentUpdate);
