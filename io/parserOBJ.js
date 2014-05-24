/*
 * 
 *                  xxxxxxx      xxxxxxx
 *                   x:::::x    x:::::x 
 *                    x:::::x  x:::::x  
 *                     x:::::xx:::::x   
 *                      x::::::::::x    
 *                       x::::::::x     
 *                       x::::::::x     
 *                      x::::::::::x    
 *                     x:::::xx:::::x   
 *                    x:::::x  x:::::x  
 *                   x:::::x    x:::::x 
 *              THE xxxxxxx      xxxxxxx TOOLKIT
 *                    
 *                  http://www.goXTK.com
 *                   
 * Copyright (c) 2012 The X Toolkit Developers <dev@goXTK.com>
 *                   
 *    The X Toolkit (XTK) is licensed under the MIT License:
 *      http://www.opensource.org/licenses/mit-license.php
 * 
 *      "Free software" is a matter of liberty, not price.
 *      "Free" as in "free speech", not as in "free beer".
 *                                         - Richard M. Stallman
 * 
 * 
 */

// provides
goog.provide('X.parserOBJ');

// requires
goog.require('X.event');
goog.require('X.object');
goog.require('X.parser');
goog.require('X.triplets');

/**
 * Create a parser for the .OBJ format. ASCII or binary format is supported.
 * 
 * @constructor
 * @extends X.parser
 */
X.parserOBJ = function() {

  //
  // call the standard constructor of X.base
  goog.base(this);
  
  //
  // class attributes
  
  /**
   * @inheritDoc
   * @const
   */
  this._classname = 'parserOBJ';
  
};
// inherit from X.parser
goog.inherits(X.parserOBJ, X.parser);


/**
 * @inheritDoc
 */
X.parserOBJ.prototype.parse = function(container, object, data, flag) {

  X.TIMER(this._classname + '.parse');
  
  this._data = data;
  var _length = data.byteLength;
  var byteData = this.scan('uchar', _length);

  // allocate memory using a good guess
  object._points = new X.triplets(_length);
  object._normals = new X.triplets(_length);
  var _pts = [],
      _texCoords = [],
      _normals = [],
      p = object._points,
      n = object._normals,
      tc = [],
      numFaces = 0;
  
  // store the beginning of the byte range
  var _rangeStart = 0;
 
  for (var i = 0; i < _length; ++i) {
     
     if (byteData[i] == 10) { // line break

       var _substring = this.parseChars(byteData, _rangeStart, i);
       
       var _d = _substring.replace(/\s{2,}/g, ' ').split(' ');

       if (_d[0] == "v") {

         // grab the x, y, z coordinates
         var x = parseFloat(_d[1]);
         var y = parseFloat(_d[2]);
         var z = parseFloat(_d[3]);
         _pts.push([x,y,z]);

       } else if (_d[0] == "f") {

         for (var idx = 0; idx < 3; idx++) {  

            // split up eventual texture- and/or normal-coordinate indices
            var _vinfo = _d[idx+1].split('/');

            // _vinfo.length() === 1 -> vertex index given
            // _vinfo.length() === 2 -> vertex + texture-coordinate index given
            // _vinfo.length() === 3 -> vertex + texture + normal coordinate index given

            // assumes all points have been read
            var p1 = _pts[parseInt(_vinfo[0], 10)-1];
  
            p.add(p1[0], p1[1], p1[2]);

            // handle texture coordinates, if present:
            if (_vinfo.length >= 2 && _vinfo[1].length) {
              var tcoord = _texCoords[_vinfo[1]-1];
              tc.push(tcoord[0]);
              tc.push(tcoord[1]);

            }

            // handle normals, if present:
            var norm;
            // check if normal is already given in .obj file, otherwise calculate it
            if (_vinfo.length === 3 && _vinfo[2].length) {

              var n1 = _normals[parseInt(_vinfo[2], 10)-1];

              norm = new goog.math.Vec3(n1[0], n1[1], n1[2]);
              norm.normalize();
              n.add(norm.x, norm.y, norm.z);

            } else if (idx === 2) { // calculate normal, when all 3 vertex points are read
                                    // in and no normal is given in .OBJ file

                var len = p._dataPointer / 3;

                var v1 = new goog.math.Vec3(p.get(len-3)[0], p.get(len-3)[1], p.get(len-3)[2]);
                var v2 = new goog.math.Vec3(p.get(len-2)[0], p.get(len-2)[1], p.get(len-2)[2]);
                var v3 = new goog.math.Vec3(p.get(len-1)[0], p.get(len-1)[1], p.get(len-1)[2]);
                
                norm = goog.math.Vec3.cross(v2.subtract(v1),v3.subtract(v1));
                norm.normalize();

                n.add(norm.x, norm.y, norm.z);
                n.add(norm.x, norm.y, norm.z);
                n.add(norm.x, norm.y, norm.z);

            }

         }

         numFaces++;

       } else if (_d[0] == "vn") {
         var x = parseFloat(_d[1]);
         var y = parseFloat(_d[2]);
         var z = parseFloat(_d[3]);
     
         _normals.push([x, y, z]);

       } else if (_d[0] == "vt") {
         var s = parseFloat(_d[1]);
         var t = parseFloat(_d[2]);
     
         _texCoords.push([s,t]);

       }

       _rangeStart = i+1; // skip the newline character

     }
  
  }

  // finalize arrays:
  if (tc.length) {
    object._textureCoordinateMap = tc;
  }
  p.resize();
  n.resize();

  // console.log('OBJ stats:');
  // console.log(' * verts:     ' + _pts.length);
  // console.log(' * faces:     ' + numFaces);
  // console.log(' * normals:   ' + n._dataPointer / 3);
  // console.log(' * texCoords: ' + tc.length/2);

  X.TIMERSTOP(this._classname + '.parse');
  
  // the object should be set up here, so let's fire a modified event
  var modifiedEvent = new X.event.ModifiedEvent();
  modifiedEvent._object = object;
  modifiedEvent._container = container;
  this.dispatchEvent(modifiedEvent);
};

// export symbols (required for advanced compilation)
goog.exportSymbol('X.parserOBJ', X.parserOBJ);
goog.exportSymbol('X.parserOBJ.prototype.parse', X.parserOBJ.prototype.parse);
