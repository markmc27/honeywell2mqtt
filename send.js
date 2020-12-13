#!/usr/bin/env node
const program = require('commander')
const mqtt = require('mqtt')

program
  .version('3.0.0')
  .option('-p, --packet <item>', 'JSON packet data (as string)')
  .parse(process.argv)

const options = {
	port: process.env.MQTT_PORT,
  clientId: process.env.MQTT_CLIENT_ID,
	username: process.env.MQTT_USERNAME,
	password: process.env.MQTT_PASSWORD
}

const packet = JSON.parse(program.packet)
try {
  if(!packet["rows"][0]["data"].startsWith('f34dcef9a6e77cd373be69b9d')){
    return;
  }
}catch{
  console.log('Error when parsing packet', packet);
  return;
}


const client = mqtt.connect('mqtt://' + process.env.MQTT_HOST,options)

const discoveryPrefix = process.env.MQTT_DISCOVERY_PREFIX

client.on('connect', function () {
  console.log(packet);

  // See if there is a name map
  var fName = 'doorbell';

  // Set base topic
  let baseTopic = `${discoveryPrefix}/binary_sensor/1`

  // Send the discovery message
  let configPayload = `{"name": "${fName}", "uniq_id": "1", "state_topic": "${baseTopic}/state", "dev_cla": "motion"}`
  client.publish(`${baseTopic}/config`, configPayload, {qos: 1, retain: true})

  console.log(`Topic: ${baseTopic}/config`)
  console.log(`Payload: ${configPayload}`)
  console.log('--')
  client.publish(`${baseTopic}/state`, 'ON', {qos: 1, retain: true})
  console.log(`Topic: ${baseTopic}/state`)
  console.log(`Payload: ON`)
  console.log('--');
  client.publish(`${baseTopic}/state`, 'OFF', {qos: 1, retain: true})
  console.log(`Topic: ${baseTopic}/state`)
  console.log(`Payload: OFF`)
  client.end()
})
