test = function() {

  // create a new test_renderer
  test_renderer = new X.renderer3D();
  test_renderer.init();

  // load a .vtk file
  var surface = new X.mesh();
  surface.file = 'data/tri-normals.obj';
  surface.color = [0,1,0];

  // add the object
  test_renderer.add(surface);

  // .. and render it
  test_renderer.render();

};
