/*
 * Contains all functions for api requests to the server.
 */

// Creates a POST request.
export function buildPostPayload(data) {
  return {
    method: 'POST',
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
  const response = await fetch('/api/evora/temperature/');
  // The same applies here - we make another dotted line between trying to read the response
  // body as JSON and the remainder of the function
  const data = await response.json();
  // Remember that async makes this return a Promise. This return statement "resolves" the
  // promise. If some other part of our code awaits getTemperature(), it will resume after
  // after this return statement.
  return data;
  // return await response.json()
}

export async function initialize() {
  const response = await fetch('/api/evora/initialize');
  if (response.status !== 200) {
    // if the response was not OK
    return false;
  }
  return await response.json();
}

export async function shutdown() {
  const response = await fetch('/api/evora/shutdown');
  const data = await response.json();
  return data;
}

export async function setTemperature(input: number) {
  const response = await fetch(
    `/api/evora/temperature/set?temperature=${input}`
  );

  if (response.status !== 200) {
    // if the response was not OK
    return false;
  }

  const data = await response.json();
  return data;
}

export async function capture(input) {
  console.log(input);

  const response = await fetch('/api/evora/expose/', {
    method: 'POST',
    body: JSON.stringify(input),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });

  const data = await response.json();

  return data;
}

export async function abort() {
  const response = await fetch('/api/evora/expose/abort');
  const data = await response.json();
  return data;
}

export async function setFilter(input) {
  const response = await fetch('/api/evora/setFilter', {
    method: 'POST',
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
  const response = await fetch('/api/evora/getStatusTEC');

  const data = await response.json();

  return data;
}

export async function getStatus() {
  const response = await fetch('/api/evora/status/');
  const data = await response.json();
  return data;
}

export async function getFilterWheel() {
  const response = await fetch('/api/evora/filter/');
  const data = await response.json();
  return data;
}

export async function setFilterWheel(filter: string) {
  const response = await fetch(`/api/evora/filter/set?filter_name=${filter}`);
  const data = await response.json();
  return data;
}

export async function homeFilterWheel() {
  const response = await fetch('/api/evora/filter/home');
  const data = await response.json();
  return data;
}

export async function getWeatherData() {
  const response = await fetch('/api/evora/weather/');
  const data = await response.json();
  return data;
}

export const MIN_FOCUS_DELTA = 400;
export const MAX_FOCUS_DELTA = 10000;

export async function moveFocus(amount: number) {
  if (
    Math.abs(amount) > MAX_FOCUS_DELTA ||
    Math.abs(amount) < MIN_FOCUS_DELTA
  ) {
    return false;
  }
  const response = await fetch(`/api/focus/move?steps=${amount}`, {
    method: 'POST',
    body: JSON.stringify(''),
    cache: 'no-cache',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  });
  if (response.status !== 200) {
    return { error: 'Connection to evora server failed' };
  }
  const data = await response.json();
  return data;
}

export async function getFocus() {
  const response = await fetch('/api/focus/status');
  if (response.status !== 200) {
    return { error: 'Connection to evora server failed' };
  }
  const data = await response.json();
  return data;
}
