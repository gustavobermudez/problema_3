import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import FileContent from './file-content';
import FileContentDetail from './file-content-detail';
import FileContentUpdate from './file-content-update';
import FileContentDeleteDialog from './file-content-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={FileContentDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={FileContentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={FileContentUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={FileContentDetail} />
      <ErrorBoundaryRoute path={match.url} component={FileContent} />
    </Switch>
  </>
);

export default Routes;
