/*
 * Contains all functions for api requests to the server.
 */

// Creates a POST request.
export function buildPostPayload(data) {
  return {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  };
}

// export makes this available for import from other files, e.g. App.js
// async makes it so we can use "await" inside. It also makes it return a Promise.
export async function getTemperature() {
  // if we got this page from localhost:3001, this will request localhost:3001/temperature
  // await is kind of like a dotted line where the interpreter snips the function in two.
  // Everything that would execute after the await keyword is shelved until the network
  // request completes.
  const response = await fetch('/api/getTemperature');
  // The same applies here - we make another dotted line between trying to read the response
  // body as JSON and the remainder of the function
  const data = await response.json();
  console.log(data);
  // Remember that async makes this return a Promise. This return statement "resolves" the
  // promise. If some other part of our code awaits getTemperature(), it will resume after
  // after this return statement.
  return JSON.stringify(data);
  // return await response.json()
}

export async function initialize() {
    const response = await fetch('/api/initialize')
    const data = await response.json()
    return JSON.stringify(data)
}

export async function shutdown() {
    const response = await fetch('/api/shutdown')
    const data = await response.json()
    return JSON.stringify(data)
}

export async function setTemperature(input) {
  //need to pass in input variable into Flask server
  console.log(typeof input);
  const response = await fetch('/api/setTemperature', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ temperature: input.toString() }),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });

  const data = await response.json();

  return JSON.stringify(data);
}

export async function capture(input) {
  const response = await fetch('/api/capture', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(input),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });

  const data = await response.json();

  return data;
}

export async function setFilter(input) {
  const response = await fetch('/api/setFilter', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(input),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });

  const data = await response.json();

  return data;
}

export async function getStatusTEC() {
  const response = await fetch('/api/getStatusTEC');

  const data = await response.json();

  return data;
}

export async function getStatus() {
  const response = await fetch('/api/getStatus');
  const data = await response.json();
  return JSON.stringify(data);
}

export async function getFilterWheel() {
  const response = await fetch('/api/getFilterWheel');
  const data = await response.json();
  return data;
}

export async function setFilterWheel(filter) {
  const payload = buildPostPayload({ filter });
  console.log(payload);
  const response = await fetch('/api/setFilterWheel', payload);
  const data = await response.json();
  return data;
}

export async function homeFilterWheel() {
  const response = await fetch('/api/homeFilterWheel');
  const data = await response.json();
  return data;
}
