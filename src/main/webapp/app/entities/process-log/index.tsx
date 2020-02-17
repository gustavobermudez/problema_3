import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ProcessLog from './process-log';
import ProcessLogDetail from './process-log-detail';
import ProcessLogUpdate from './process-log-update';
import ProcessLogDeleteDialog from './process-log-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ProcessLogDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ProcessLogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ProcessLogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ProcessLogDetail} />
      <ErrorBoundaryRoute path={match.url} component={ProcessLog} />
    </Switch>
  </>
);

export default Routes;
