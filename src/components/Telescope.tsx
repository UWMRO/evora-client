/*
 *  @Filename: Telescope.jsx
 *  @License: BSD 3-clause (http://www.opensource.org/licenses/BSD-3-Clause)
 */

function TelescopeControl() {
  const sendCommand = (command: string) => {
    fetch(`/tcs/ascii/${command}`, { method: 'GET' })
      .then()
      .catch((error) => {
        console.error(`Error sending command ${command}:`, error);
      });
  };

  return (
    <>
      <h2 style={{ margin: '10px' }}>Telescope Controls</h2>
      <div style={{ justifySelf: 'center', display: 'grid' }}>
        <div
          style={{
            justifySelf: 'center',
            width: '300px',
            marginTop: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column',
          }}
        >
          <button
            style={{ margin: '10px', padding: '20px 30px', fontSize: '24px' }}
            onClick={() => sendCommand('park')}
          >
            Go to Park
          </button>

          <button
            style={{ margin: '10px', padding: '20px 30px', fontSize: '24px' }}
            onClick={() => sendCommand('goto_cover')}
          >
            Go to Cover Position
          </button>

          <button
            style={{ margin: '10px', padding: '20px 30px', fontSize: '24px' }}
            onClick={() => sendCommand('sync_to_zenith')}
          >
            Initialise to Zenith
          </button>

          <button
            style={{
              margin: '10px',
              padding: '20px 30px',
              fontSize: '24px',
              backgroundColor: 'darkred',
            }}
            onClick={() => sendCommand('stop')}
          >
            STOP
          </button>
        </div>
      </div>
    </>
  );
}

export default TelescopeControl;
