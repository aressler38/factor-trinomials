#/bin/bash -x

MAJOR=1 
MINOR=3 # app feature set / patch
GIT_REVISION=$(git log --oneline | wc -l)
PROJECT_HOME=$1

if [ "$PROJECT_HOME" == "" ]; then
    echo "ERROR ... NO PROJECT_HOME SPECIFIED"
    exit
fi


echo "WRITING NEW VERSIONS TO JSON FILES"
sed 's/version".*\?/version": "'$MAJOR'.'$MINOR'.'$GIT_REVISION'",/' $PROJECT_HOME/package.json > $PROJECT_HOME/json.tmp.txt
mv $PROJECT_HOME/json.tmp.txt $PROJECT_HOME/package.json
sed 's/version".*\?/version": "'$MAJOR'.'$MINOR'.'$GIT_REVISION'",/' $PROJECT_HOME/manifest.json > $PROJECT_HOME/json.tmp.txt
mv $PROJECT_HOME/json.tmp.txt $PROJECT_HOME/manifest.json

