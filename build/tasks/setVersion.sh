#/bin/bash -x


PROJECT_HOME=$1

if [ "$PROJECT_HOME" == "" ]; then
    echo "ERROR ... NO PROJECT_HOME SPECIFIED"
    exit
fi

# SET VERSIONS 
MAJOR=1 
MINOR=2 # app feature set / patch
GIT_REVISION=$(git log --oneline | wc -l)

echo "WRITING NEW VERSIONS TO JSON FILES"
sed 's/version".*\?/version": "'$MAJOR'.'$MINOR'.'$GIT_REVISION'",/' $PROJECT_HOME/package.json > $PROJECT_HOME/json.tmp.txt
mv $PROJECT_HOME/json.tmp.txt $PROJECT_HOME/package.json
sed 's/version".*\?/version": "'$MAJOR'.'$MINOR'.'$GIT_REVISION'",/' $PROJECT_HOME/manifest.json > $PROJECT_HOME/json.tmp.txt
mv $PROJECT_HOME/json.tmp.txt $PROJECT_HOME/manifest.json

