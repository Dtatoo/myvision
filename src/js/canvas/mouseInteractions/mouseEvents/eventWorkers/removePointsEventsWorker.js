import {
  setEditablePolygon, removePolygonPoint, removePolygonPoints, getPolygonEditingStatus,
  getPolygonIdIfEditing, cleanPolygonPointsArray, changeExistingPolygonPointsToRemovable,
  getPolygonIfEditing,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { removeEditedPolygonId } from './editPolygonEventsWorker';

let selectedPolygonId = null;
let newPolygonSelected = false;
let canvas = null;
let removedPolygonPoints = false;
let selectedNothing = false;

function generateNewPointsIfInterruptedAddPoints(canvasObj, interruptedAddPoints) {
  if (interruptedAddPoints) {
    removePolygonPoints();
    setEditablePolygon(canvasObj, getPolygonIfEditing(), true);
  } else {
    changeExistingPolygonPointsToRemovable();
  }
}

function setRemovablePointsEventsCanvas(canvasObj, interruptedAddPoints) {
  generateNewPointsIfInterruptedAddPoints(canvasObj, interruptedAddPoints);
  canvas = canvasObj;
  selectedPolygonId = getPolygonIdIfEditing();
}

function prepareToEditPolygonPoints(event) {
  if (removedPolygonPoints) {
    cleanPolygonPointsArray();
    removedPolygonPoints = false;
  }
  removePolygonPoints();
  removeEditedPolygonId();
  setEditablePolygon(canvas, event.target, true);
  selectedPolygonId = event.target.id;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedPolygonId = null;
}

function pointMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'point') {
      removePolygonPoint(event.target.pointId);
      removedPolygonPoints = true;
    } else {
      if (event.target.shapeName === 'polygon') {
        newPolygonSelected = (event.target.id !== selectedPolygonId);
      }
      preventActiveObjectsAppearInFront(canvas);
    }
    selectedNothing = false;
  } else {
    selectedNothing = true;
  }
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'red';
    canvas.renderAll();
  }
}

function pointMouseUpEvents(event) {
  // bug where creating two new polygons, selecting remove, selecting one and dragging it is allowed
  // remove points button and left click on one then dragon on another, repeat and bug
  if (event.target && event.target.shapeName === 'polygon' && (selectedNothing || newPolygonSelected)) {
    // subset can be reused
    prepareToEditPolygonPoints(event);
  } else if ((!event.target && getPolygonEditingStatus()) || (event.target && event.target.shapeName === 'bndBox')) {
    setPolygonNotEditableOnClick();
  }
}

function pointMouseOutEvents(event) {
  if (event.target && event.target.shapeName === 'point') {
    event.target.stroke = 'black';
    canvas.renderAll();
  }
}

function getSelectedPolygonIdForRemovingPoints() {
  return selectedPolygonId;
}

export {
  pointMouseDownEvents, pointMouseOverEvents,
  pointMouseUpEvents, pointMouseOutEvents,
  setRemovablePointsEventsCanvas, getSelectedPolygonIdForRemovingPoints,
};
