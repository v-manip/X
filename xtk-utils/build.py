#
#
#

#
# configuration
#
projectName = 'sampleApp'

##############################################################################

#
# imports
#
import os, sys

#
# find folders
#

# xtk-utils dir
xtkUtilsDir = os.path.abspath( os.path.dirname( sys.argv[0] ) )

# project root dir
projectRootDir = os.path.normpath( xtkUtilsDir + os.sep + '..' + os.sep )

# closure-library dir
closureLibraryDir = os.path.normpath( projectRootDir + os.sep + 'closure-library' )

# closurebuilder.py
closureBuilderFilePath = os.path.normpath( closureLibraryDir + os.sep + 'closure' + os.sep + 'bin' + os.sep + 'build' + os.sep + 'closurebuilder.py' )

# compiler.jar
compilerFilePath = os.path.normpath( closureLibraryDir + os.sep + 'compiler-latest' + os.sep + 'compiler.jar' )

# xtk dir
xtkDir = os.path.normpath( projectRootDir + os.sep + 'xtk' )

# application dir
appDir = os.path.normpath( projectRootDir + os.sep + projectName )

# output filePath
outputFilePath = os.path.normpath( projectRootDir + os.sep + projectName + '-build.js' )

#
# generate build command
#
command = closureBuilderFilePath
command += ' --root=' + closureLibraryDir
command += ' --root=' + xtkDir
command += ' --root=' + appDir
command += ' --namespace=' + projectName
command += ' --output_mode=compiled'
command += ' --compiler_jar=' + compilerFilePath
command += ' -f "--warning_level=VERBOSE"'
command += ' > ' + outputFilePath

#
# run, forest, run
#
os.system( command )