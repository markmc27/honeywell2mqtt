#!/bin/sh

# A simple script that will receive events from a RTL433 SDR
# It is tuned to listen to 345.00 MHz with the Honeywell driver

# Author: Chris Kacerguis <chris@fuzzyblender.com>

set -x

export LANG=C
PATH="/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/bin:/sbin"

# Start the listener and enter an endless loop
echo "Starting RTL listening on ${LISTEN_FREQUENCY} to decode ${DECODE_PROTOCOL}"
/usr/local/bin/rtl_433 -f ${LISTEN_FREQUENCY} -F json -R ${DECODE_PROTOCOL} | while read line
do
  node /app/send.js -p "$line"
done
