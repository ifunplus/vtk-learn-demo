import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';

import controlPanel from './controller.html';

import vtkActor           from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCalculator      from 'vtk.js/Sources/Filters/General/Calculator';
import vtkConeSource      from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper          from 'vtk.js/Sources/Rendering/Core/Mapper';
import { AttributeTypes } from 'vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants';
import { FieldDataTypes } from 'vtk.js/Sources/Common/DataModel/DataSet/Constants';

//sources
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkCursor3D from 'vtk.js/Sources/Filters/Sources/Cursor3D';
import vtkCylinderSource from 'vtk.js/Sources/Filters/Sources/CylinderSource';
import vtkImageGridSource from 'vtk.js/Sources/Filters/Sources/ImageGridSource';
import vtkLineSource from 'vtk.js/Sources/Filters/Sources/LineSource';
import vtkPlaneSource from 'vtk.js/Sources/Filters/Sources/PlaneSource';
import vtkPointSource from 'vtk.js/Sources/Filters/Sources/PointSource';
import vtkCircleSource from 'vtk.js/Sources/Filters/Sources/CircleSource';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();

// ----------------------------------------------------------------------------
// Sources Example code
// ----------------------------------------------------------------------------

const coneSource = vtkConeSource.newInstance({ height: 1.0 });
const coneOutputPort = coneSource.getOutputPort();

const cubeSource = vtkCubeSource.newInstance({ 
    xLength: 5, yLength: 5, zLength: 5,
    center:[0.5,200.6,0.9],rotations:[45,45,45]
 });
const cubePolydata = cubeSource.getOutputData()
console.log(" cubePolydata: ",cubePolydata)
const cubeOutputPort = cubeSource.getOutputPort();

/**??????????????? */
const cursorSource = vtkCursor3D.newInstance({
    focalPoint: [-50, 50, -25], 
    //x???????????????????????????y???????????????????????????z????????????????????????
    //x???????????????????????????y???????????????????????????z???????????????????????????
    modelBounds: [-100, 100, -100, 100, -100, 100]});
const cursorPolyData = cursorSource.getOutputData();
const cursorOutputPort = cursorSource.getOutputPort();
console.log(" cursorPolyData: ",cursorPolyData)

/**??????*/
//??????????????????????????????????????????????????????  resolution???????????????
const cylinderSource = vtkCylinderSource.newInstance({ height: 1, radius: 1, resolution: 8 });
const cylinderOutputPort = cylinderSource.getOutputPort();

/**not shown*/
const imageGridSource = vtkImageGridSource.newInstance({
    gridSpacing: [10, 10, 0],
    gridOrigin: [0, 0, 1],
    dataSpacing: [1.0, 1.0, 1.0],
    dataOrigin: [0.1, 0.5, 1.0]
});
const imageGridOutputPort = imageGridSource.getOutputPort();

/**?????? ???????????? resolution???????????????10??????*/
const lineSource = vtkLineSource.newInstance({ resolution: 10,
    point1:[0,0,0], point2:[0,0,10]
 });
const lineOutputData = lineSource.getOutputData();
const lineOutputPort = lineSource.getOutputPort();
console.log("lineOutputData: ",lineOutputData)

/**???  resolution??????????????????????????????*/
const planeSource = vtkPlaneSource.newInstance({ 
    xResolution: 5, 
    yResolution: 5,
   });
const planeOutputPort = planeSource.getOutputPort();

const pointSource = vtkPointSource.newInstance({ 
    numberOfPoints: 5, 
   });
const pointOutputPort = pointSource.getOutputPort();

//??? ??? ???????????????????????? resolution??????????????????????????????
const circleSource = vtkCircleSource.newInstance({ 
     radius: 1, resolution: 8 
   });
const cicleOutputPort = circleSource.getOutputPort();


const filter = vtkCalculator.newInstance();
filter.setInputConnection(cicleOutputPort);

filter.setFormula({
  getArrays: inputDataSets => ({
    input: [],
    output: [
      { location: FieldDataTypes.CELL, name: 'Random', dataType: 'Float32Array', attribute: AttributeTypes.SCALARS },
    ],
  }),
  evaluate: (arraysIn, arraysOut) => {
    const [scalars] = arraysOut.map(d => d.getData());
    for (let i = 0; i < scalars.length; i++) {
      scalars[i] = Math.random();
    }
  },
});

const mapper = vtkMapper.newInstance();
mapper.setInputConnection(filter.getOutputPort());

const actor = vtkActor.newInstance();
actor.setMapper(mapper);

renderer.addActor(actor);
renderer.resetCamera();
renderWindow.render();

// -----------------------------------------------------------
// UI control handling
// -----------------------------------------------------------

fullScreenRenderer.addController(controlPanel);
const representationSelector = document.querySelector('.representations');
const resolutionChange = document.querySelector('.resolution');

representationSelector.addEventListener('change', (e) => {
  const newRepValue = Number(e.target.value);
  actor.getProperty().setRepresentation(newRepValue);
  renderWindow.render();
});

resolutionChange.addEventListener('input', (e) => {
  const resolution = Number(e.target.value);
  coneSource.setResolution(resolution);
  renderWindow.render();
});