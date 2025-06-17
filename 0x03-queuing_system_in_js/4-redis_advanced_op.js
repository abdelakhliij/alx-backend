#!/usr/bin/node
/**
 * Connect to Redis and store multiple fields in a hash using MULTI
 */

import { createClient, print } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');

  // Clean the key first to avoid WRONGTYPE errors
  client.del('ALX', (delErr) => {
    if (delErr) {
      console.error('Error deleting ALX key:', delErr);
      return;
    }

    // Queue multiple HSETs with MULTI
    const multi = client.multi();
    multi.HSET('ALX', 'Portland', 50, print);
    multi.HSET('ALX', 'Seattle', 80, print);
    multi.HSET('ALX', 'New York', 20, print);
    multi.HSET('ALX', 'Bogota', 20, print);
    multi.HSET('ALX', 'Cali', 40, print);
    multi.HSET('ALX', 'Paris', 2, print);

    // Execute the MULTI queue
    multi.exec((err, replies) => {
      if (err) {
        console.error('Exec error:', err);
      } else {
        // Retrieve and display the full hash
        client.HGETALL('ALX', (err, hashset) => {
          if (err) {
            console.error('HGETALL error:', err);
          } else {
            console.log(hashset);
          }
          client.quit(); // Always close the client
        });
      }
    });
  });
});

