import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IFileContent, defaultValue } from 'app/shared/model/file-content.model';

export const ACTION_TYPES = {
  FETCH_FILECONTENT_LIST: 'fileContent/FETCH_FILECONTENT_LIST',
  FETCH_FILECONTENT: 'fileContent/FETCH_FILECONTENT',
  CREATE_FILECONTENT: 'fileContent/CREATE_FILECONTENT',
  UPDATE_FILECONTENT: 'fileContent/UPDATE_FILECONTENT',
  DELETE_FILECONTENT: 'fileContent/DELETE_FILECONTENT',
  SET_BLOB: 'fileContent/SET_BLOB',
  RESET: 'fileContent/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IFileContent>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type FileContentState = Readonly<typeof initialState>;

// Reducer

export default (state: FileContentState = initialState, action): FileContentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FILECONTENT_LIST):
    case REQUEST(ACTION_TYPES.FETCH_FILECONTENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_FILECONTENT):
    case REQUEST(ACTION_TYPES.UPDATE_FILECONTENT):
    case REQUEST(ACTION_TYPES.DELETE_FILECONTENT):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_FILECONTENT_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FILECONTENT):
    case FAILURE(ACTION_TYPES.CREATE_FILECONTENT):
    case FAILURE(ACTION_TYPES.UPDATE_FILECONTENT):
    case FAILURE(ACTION_TYPES.DELETE_FILECONTENT):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_FILECONTENT_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_FILECONTENT):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_FILECONTENT):
    case SUCCESS(ACTION_TYPES.UPDATE_FILECONTENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_FILECONTENT):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/file-contents';

// Actions

export const getEntities: ICrudGetAllAction<IFileContent> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_FILECONTENT_LIST,
  payload: axios.get<IFileContent>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IFileContent> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_FILECONTENT,
    payload: axios.get<IFileContent>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IFileContent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_FILECONTENT,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IFileContent> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_FILECONTENT,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IFileContent> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_FILECONTENT,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
