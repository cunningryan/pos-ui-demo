import { useRef, useState } from 'preact/hooks';
import { connect } from 'redux-bundler-preact';
import { openAppStore } from '../../../utils/square';

import Modal from '../../lib/Modal';
import QuestionMarkCircle from '../../lib/icons/QuestionMarkCircle';
import ExclamationCircle from '../../lib/icons/ExclamationCircle';

import NewDeviceSetupDownload from './NewDeviceSetupDownload';
import NewDeviceSetupStart from './NewDeviceSetupStart';
import NewDeviceSetupFinish from './NewDeviceSetupFinish';

const setupState = {
  INIT: 'INIT',
  REQUEST_CODE: 'REQUEST_CODE',
  DOWNLOAD_SQUARE: 'DOWNLOAD_SQUARE',
  FINISH: 'FINISH',
};

const validPhone = /^(\+\d{1,2}\s)?[\(]?\d{3}[\)]?[\s.-]?\d{3}[\s.-]?\d{4}$/g;

const NewDeviceSetup = ({ doSetDeviceStatusAuthorized, doRequestDeviceCode }) => {
  const [currentState, updateState] = useState(setupState.INIT);
  switch (currentState) {
    case setupState.REQUEST_CODE: {
      const [errors, setErrors] = useState(false);
      const input = useRef(null);

      return (
        <Modal
          title="Enter your mobile number"
          icon={<QuestionMarkCircle />}
          primaryButtonText="Request Device Code"
          primaryAction={() => {
            if (!validPhone.exec(input.current.value)) {
              setErrors(true);
            } else {
              setErrors(false);
              doRequestDeviceCode(input.current.value).then(() => {
                updateState(setupState.DOWNLOAD_SQUARE);
              });
            }
          }}
          secondaryButtonText="<< Back"
          secondaryAction={() => updateState(setupState.INIT)}
        >
          <div>
            <p>
              First, enter your mobile number. We'll use this number to text you the device code.
            </p>

            <div class="text-left my-8">
              <label for="phone_number" class="block text-sm font-medium leading-5 text-gray-700">
                Phone Number
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  id="phone_number"
                  ref={input}
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  required
                  class={`form-input block w-full sm:text-sm sm:leading-5 ${errors &&
                    'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'}`}
                  placeholder="+1 (555) 987-6543"
                  onInput={e => {
                    if (errors) {
                      setErrors(false);
                    }
                  }}
                />
              </div>
              {errors && (
                <p class="mt-2 text-sm text-red-600" id="email-error">
                  You must enter a valid phone number.
                </p>
              )}
            </div>
          </div>
        </Modal>
      );
    }
    case setupState.DOWNLOAD_SQUARE:
      return (
        <Modal
          title="Download Square Point of Sale"
          icon={<QuestionMarkCircle />}
          primaryButtonText="Open App Store"
          primaryAction={() => {
            updateState(setupState.FINISH);
            openAppStore();
          }}
          secondaryButtonText="<< Back"
          secondaryAction={() => updateState(setupState.REQUEST_CODE)}
        >
          <NewDeviceSetupDownload />
        </Modal>
      );
    case setupState.FINISH:
      return (
        <Modal
          title="Complete Setup of your Device"
          icon={<QuestionMarkCircle />}
          primaryButtonText="Registration Complete"
          primaryAction={() => {
            doSetDeviceStatusAuthorized();
          }}
          secondaryButtonText="<< Back"
          secondaryAction={() => updateState(setupState.DOWNLOAD_SQUARE)}
        >
          <NewDeviceSetupFinish />
        </Modal>
      );
    case setupState.INIT:
    default:
      return (
        <Modal
          title="You need to register your device!"
          icon={<ExclamationCircle />}
          primaryButtonText="Begin Setup >>"
          primaryAction={() => updateState(setupState.REQUEST_CODE)}
          secondaryButtonText="This Device is Registered"
          secondaryAction={() => doSetDeviceStatusAuthorized()}
        >
          <NewDeviceSetupStart />
        </Modal>
      );
  }
};

export default connect('doSetDeviceStatusAuthorized', 'doRequestDeviceCode', NewDeviceSetup);
