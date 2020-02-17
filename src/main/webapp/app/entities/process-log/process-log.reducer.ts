import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IProcessLog, defaultValue } from 'app/shared/model/process-log.model';

export const ACTION_TYPES = {
  FETCH_PROCESSLOG_LIST: 'processLog/FETCH_PROCESSLOG_LIST',
  FETCH_PROCESSLOG: 'processLog/FETCH_PROCESSLOG',
  CREATE_PROCESSLOG: 'processLog/CREATE_PROCESSLOG',
  UPDATE_PROCESSLOG: 'processLog/UPDATE_PROCESSLOG',
  DELETE_PROCESSLOG: 'processLog/DELETE_PROCESSLOG',
  RESET: 'processLog/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IProcessLog>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ProcessLogState = Readonly<typeof initialState>;

// Reducer

export default (state: ProcessLogState = initialState, action): ProcessLogState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_PROCESSLOG_LIST):
    case REQUEST(ACTION_TYPES.FETCH_PROCESSLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_PROCESSLOG):
    case REQUEST(ACTION_TYPES.UPDATE_PROCESSLOG):
    case REQUEST(ACTION_TYPES.DELETE_PROCESSLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_PROCESSLOG_LIST):
    case FAILURE(ACTION_TYPES.FETCH_PROCESSLOG):
    case FAILURE(ACTION_TYPES.CREATE_PROCESSLOG):
    case FAILURE(ACTION_TYPES.UPDATE_PROCESSLOG):
    case FAILURE(ACTION_TYPES.DELETE_PROCESSLOG):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSLOG_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_PROCESSLOG):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROCESSLOG):
    case SUCCESS(ACTION_TYPES.UPDATE_PROCESSLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROCESSLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/process-logs';

// Actions

export const getEntities: ICrudGetAllAction<IProcessLog> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_PROCESSLOG_LIST,
  payload: axios.get<IProcessLog>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IProcessLog> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_PROCESSLOG,
    payload: axios.get<IProcessLog>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IProcessLog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_PROCESSLOG,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IProcessLog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PROCESSLOG,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IProcessLog> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_PROCESSLOG,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
