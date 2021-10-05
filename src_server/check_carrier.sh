#!/bin/bash
CARRIER_PATH=/home/elabox/apps/ela.carrier
BOOTSTRAP_FILE=${CARRIER_PATH}/bootstrapd.conf
CURRENT_IP=$(curl -s ifconfig.me)
echo "$CURRENT_IP"
CARRIER_IP=$(grep "external_ip" ${BOOTSTRAP_FILE} | cut -d'"' -f 2)
echo $CARRIER_IPif [ "$CURRENT_IP" == "" ]; then
    echo "No IP found. Exiting..."
    exit 1
fiif [ "$CURRENT_IP" == "$CARRIER_IP" ]; then
    echo "Carrier is running fine"
else
    echo "Updating IP address"
    # update the IP address in the conf file
    sed -i 's/external_ip = "'$CARRIER_IP'"/external_ip = "'$CURRENT_IP'"/g' ${BOOTSTRAP_FILE}
    # stop and restart the carrier
    echo "Killing carrier "$(pgrep ela-bootstrapd)
    sudo pkill ela-bootstrapd
    #${CARRIER_PATH}/ela-bootstrapd --config=${BOOTSTRAP_FILE} --foreground
    #${CARRIER_PATH}/ela-bootstrapd --config=${BOOTSTRAP_FILE}
fi