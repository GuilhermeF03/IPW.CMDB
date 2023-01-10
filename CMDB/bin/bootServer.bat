echo "Booting Elastic..."
start cmd /k "cd ../../../elastic_kibana && bootElastic.bat"

echo "Booting CMDB server..."
start cmd /k node ".\src\cmdb-server.mjs"

echo "Closing ..."
exit


