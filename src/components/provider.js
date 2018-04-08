import Debug from 'debug';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormContext from './context';
import cancelable, * as utils from '../utils';
import reducer from '../model/reducer';
import * as actions from '../model/actions';

const debug = Debug('react-forms:provider');
const noop = () => {};

class Provider extends Component {
  state = reducer(undefined, actions.initialize);
  cancelFieldValidations = [];
  cancelFormValidation = noop;
  submit = null;
  i = 0;

  dispatch(action) {
    utils.log(this.state, action);
    return new Promise(resolve => {
      this.setState(prevState => reducer(prevState, action), resolve);
    });
  }

  componentWillUnmount() {
    debug('Unmounting');
    this.cancelValidations();
  }

  /**
   * Registers a single input
   *
   * @param {String} key Input name
   * @param {String} label Input display name
   * @param {*} value Initial value to display
   * @param {Object} functions Transformations and validators
   */
  registerField = (key, label, value, functions) => {
    debug(`Registering field '${key}' with initial value of '${value}'`);
    return this.dispatch(
      actions.registerField({
        key,
        label,
        value,
        ...functions,
      })
    );
  };

  /**
   * Registers the submit function
   *
   * @param {Function} onSubmit Submit function
   */
  registerSubmit = onSubmit => {
    debug(`Registering 'onSubmit' method`);
    this.submit = onSubmit;
    return this.dispatch(actions.registerSubmit());
  };

  /**
   * Handles client input
   *
   * @param {String} key Input name
   * @param {*} value New input value
   */
  handleChange = async (key, value) => {
    debug(`Saving value '${value}' for field '${key}'`);
    await this.dispatch(actions.changeField(key, value));
    return this.validate();
  };

  /**
   * Marks a field as touched
   *
   * @param {String} key Input name
   */
  handleTouch = async key => {
    // Short circuit if the field is already touched
    if (this.state.fields.byId[key].meta.touched) {
      return Promise.resolve();
    }

    debug(`Marking field '${key}' as 'touched'`);
    await this.dispatch(actions.touchField(key));
    return this.validate();
  };

  /**
   * Marks all fields as touched
   */
  handleTouchAll = async () => {
    debug(`Marking all fields as 'touched'`);
    await this.dispatch(actions.touchFields());
    return this.validate();
  };

  /**
   * Adds a field error to the end of the array
   *
   * @param {String} key Input name
   * @param {String} message Error message
   */
  addError = (key, message) => {
    debug(`Adding error message '${message}' for field '${key}'`);
    return this.dispatch(actions.addError(key, message));
  };

  /**
   * Mark all fields as validating
   */
  setValidating = () => {
    debug(`Marking all fields as 'validating'`);
    return this.dispatch(actions.setValidating());
  };

  /**
   * Cancels all asynchronous validations and clears cancel functions
   */
  cancelValidations = () => {
    if (!this.cancelFieldValidations.length) {
      return;
    }

    debug(`Canceling ${this.cancelFieldValidations.length} field validations`);
    this.cancelFieldValidations.forEach(cancel => cancel());
    this.cancelFieldValidations = [];

    debug(`Canceling form validation`);
    this.cancelFormValidation();
    this.cancelFormValidation = noop;
  };

  /**
   * Validates the form
   */
  validate = async () => {
    this.i += 1; // TODO: remove - debugging
    debug(`[${this.i}] Validate: Start`);

    if (!this.state.fields.allIds.length) {
      return;
    }

    // Mark all fields as validating
    await this.setValidating();

    // Cancel all currently running asynchronous validations
    this.cancelValidations();

    const { fields } = this.state;
    const { byId, allIds } = fields;

    // Validate all fields
    const validateField = async id => {
      const field = byId[id];

      // Run all validate functions for each field
      const validatePromises = field.functions.validate.map(async validator => {
        const { promise, cancel } = cancelable(
          Promise.resolve(validator(field, fields))
        );
        this.cancelFieldValidations.push(cancel);

        let message;
        try {
          message = await promise;
        } catch (err) {
          if (err.isCanceled) {
            debug('Validate: Field async validation finished but was canceled');
          }

          throw err;
        }

        if (message === undefined) {
          return;
        }

        this.addError(id, message);
      });

      try {
        await Promise.all(validatePromises);
      } catch (err) {
        if (err.isCanceled) {
          debug('Validate: Field async validation finished but was canceled');
          return;
        }

        throw err;
      }

      debug(`[${this.i}] Field '${id}' validation done`);
      this.dispatch(actions.fieldValidationDone(id));
    };

    const allValidatePromises = allIds.map(validateField);
    const { promise, cancel } = cancelable(Promise.all(allValidatePromises));
    this.cancelFormValidation = cancel;

    try {
      await promise;
    } catch (err) {
      if (err.isCanceled) {
        debug('Validate: Form async validation finished but was canceled');
        return;
      }

      throw err;
    }

    debug('Validate: Done');
  };

  /**
   * Resets the field to the initial state
   *
   * @param {String} key Field identifier
   */
  handleResetField = key => {
    debug(`Resetting field '${key}'`);
    return this.dispatch(actions.resetField(key));
  };

  /**
   * Resets the form to the initial state
   */
  handleResetForm = () => {
    debug(`Resetting all fields`);
    return this.dispatch(actions.resetFields());
  };

  /**
   * Returns false if some fields are invalid
   */
  isValid = () => {
    const { fields } = this.state;

    return fields.allIds.some(id => fields.byId[id].meta.invalid);
  };

  /**
   * Returns all field values ( <key>: <value> )
   */
  getFieldValues = () => {
    const { fields } = this.state;

    return fields.allIds.reduce((acc, fieldName) => {
      acc[fieldName] = fields.byId[fieldName].value;
      return acc;
    }, {});
  };

  /**
   * Handles submitting a form
   * Sets all fields to touched
   *
   * @param {Object} e Event
   */
  handleSubmit = async e => {
    if (!this.submit) {
      debug(`Submit: Abort (You must register 'onSubmit' handler)`);
      return;
    }

    debug('Submit: Start');
    e.preventDefault();
    await this.handleTouchAll();

    if (!this.isValid()) {
      debug('Submit: Aborted (Some fields are not valid)');
      return;
    }

    const fieldValues = this.getFieldValues();
    try {
      await this.submit(fieldValues, this.state);
    } catch (err) {
      if (err instanceof Error) {
        debug('Submit: Abort (User provided callback thrown an error)');
        throw err;
      }

      debug('Submit: Abort ( ? )', err);
    }

    debug('Submit: Done');
  };

  render() {
    const value = {
      // State
      ...this.state,
      // Handlers
      handleChange: this.handleChange,
      handleResetField: this.handleResetField,
      handleResetForm: this.handleResetForm,
      handleTouch: this.handleTouch,
      handleSubmit: this.handleSubmit,
      // Registation
      registerField: this.registerField,
      registerSubmit: this.registerSubmit,
    };

    return (
      <FormContext.Provider value={value}>
        {' '}
        {this.props.children}{' '}
      </FormContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
