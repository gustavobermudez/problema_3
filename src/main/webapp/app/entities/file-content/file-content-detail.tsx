import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './file-content.reducer';
import { IFileContent } from 'app/shared/model/file-content.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IFileContentDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const FileContentDetail = (props: IFileContentDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { fileContentEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="jhipsterSampleApplicationApp.fileContent.detail.title">FileContent</Translate> [
          <b>{fileContentEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="fileDataContent">
              <Translate contentKey="jhipsterSampleApplicationApp.fileContent.fileDataContent">File Data Content</Translate>
            </span>
          </dt>
          <dd>
            {fileContentEntity.fileDataContent ? (
              <div>
                <a onClick={openFile(fileContentEntity.fileDataContentContentType, fileContentEntity.fileDataContent)}>
                  <Translate contentKey="entity.action.open">Open</Translate>&nbsp;
                </a>
                <span>
                  {fileContentEntity.fileDataContentContentType}, {byteSize(fileContentEntity.fileDataContent)}
                </span>
              </div>
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/file-content" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/file-content/${fileContentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ fileContent }: IRootState) => ({
  fileContentEntity: fileContent.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FileContentDetail);
