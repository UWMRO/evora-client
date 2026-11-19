import { useEffect, useRef, useState } from 'react';

import {
  abortAutofocus,
  confirmAutofocus,
  getAutofocusStatus,
  getFocus,
  startAutofocus,
  type AutofocusStatus,
} from '../apiClient';

const emptyStatus: AutofocusStatus = {
  state: 'idle',
  message: '',
  completed: 0,
  total: 0,
  recommended_position: null,
};

function Focus({ isDisabled }: { isDisabled?: boolean }) {
  const [f0, setF0] = useState('');
  const [delta, setDelta] = useState('500');
  const [nPositions, setNPositions] = useState('7');
  const [exposureTime, setExposureTime] = useState('1');
  const [status, setStatus] = useState<AutofocusStatus>(emptyStatus);
  const [localError, setLocalError] = useState('');
  const pollTimer = useRef<number | undefined>(undefined);
  const alive = useRef(true);

  const running = status.state === 'running';

  useEffect(() => {
    getFocus().then((data) => {
      if (data && typeof data.step === 'number') {
        setF0((current) => (current === '' ? String(data.step) : current));
      }
    });
  }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      window.clearTimeout(pollTimer.current);
    };
  }, []);

  const applyStatus = (next: AutofocusStatus) => {
    if (!alive.current) {
      return;
    }
    setStatus(next);
    if (next.state === 'running') {
      window.clearTimeout(pollTimer.current);
      pollTimer.current = window.setTimeout(() => {
        getAutofocusStatus()
          .then(applyStatus)
          .catch((error: Error) => {
            if (alive.current) {
              setLocalError(error.message);
            }
          });
      }, 1000);
    }
  };

  const handleStart = async () => {
    setLocalError('');
    const body = {
      f0: Number(f0),
      delta: Number(delta),
      n_positions: Number(nPositions),
      exposure_time: Number(exposureTime),
    };
    if (
      !Number.isInteger(body.f0) ||
      !Number.isInteger(body.delta) ||
      body.delta === 0 ||
      !Number.isInteger(body.n_positions) ||
      body.n_positions < 3 ||
      body.n_positions > 25 ||
      !(body.exposure_time > 0) ||
      body.exposure_time > 3600
    ) {
      setLocalError(
        'Use a whole-number f0 and delta, 3 to 25 positions, and an exposure above 0 seconds and at most 3600.'
      );
      return;
    }
    try {
      applyStatus(await startAutofocus(body));
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Start failed');
    }
  };

  const handleAbort = async () => {
    setLocalError('');
    try {
      applyStatus(await abortAutofocus());
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Abort failed');
    }
  };

  const handleConfirm = async (move: boolean) => {
    setLocalError('');
    try {
      applyStatus(await confirmAutofocus(move));
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Move failed');
    }
  };

  return (
    <fieldset className='focus'>
      <legend>Autofocus</legend>
      <div className='autofocusFields'>
        <label>
          f0 (steps)
          <input
            type='number'
            value={f0}
            disabled={isDisabled || running}
            onChange={(event) => setF0(event.target.value)}
          />
        </label>
        <label>
          Delta (steps)
          <input
            type='number'
            value={delta}
            disabled={isDisabled || running}
            onChange={(event) => setDelta(event.target.value)}
          />
        </label>
        <label>
          Positions
          <input
            type='number'
            min={3}
            max={25}
            value={nPositions}
            disabled={isDisabled || running}
            onChange={(event) => setNPositions(event.target.value)}
          />
        </label>
        <label>
          Exposure (s)
          <input
            type='number'
            min={0}
            max={3600}
            step={0.1}
            value={exposureTime}
            disabled={isDisabled || running}
            onChange={(event) => setExposureTime(event.target.value)}
          />
        </label>
      </div>
      <div>
        <button
          className='temp-set'
          type='button'
          disabled={isDisabled || running}
          onClick={handleStart}
        >
          Start
        </button>
        {running && (
          <button className='tempGraphON' type='button' onClick={handleAbort}>
            Abort
          </button>
        )}
      </div>
      {running && (
        <p>
          Focusing. {status.completed} of {status.total}.
        </p>
      )}
      {!running && status.message && (
        <p style={{ color: status.state === 'error' ? 'red' : undefined }}>
          {status.message}
        </p>
      )}
      {localError && <p style={{ color: 'red' }}>{localError}</p>}
      {status.state === 'awaiting_confirm' && (
        <div>
          <button
            className='temp-set'
            type='button'
            onClick={() => handleConfirm(true)}
          >
            Move there
          </button>
          <button
            className='temp-set'
            type='button'
            onClick={() => handleConfirm(false)}
          >
            Leave it
          </button>
        </div>
      )}
    </fieldset>
  );
}

export default Focus;
