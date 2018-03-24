import Debug from 'debug';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cancelable from './utils';
import reducer from './reducer';

const debug = Debug('react-forms:form');

/**
 * Form Higher Order Component for keeping form state
 *
 * @param {Component} WrappedComponent React component
 */
const form = WrappedComponent => {
  class Form extends Component {
    state = reducer(undefined, { type: 'INITIALIZATION' });

    cancelFunctions = [];
    submit = () => {};
    updateId = 0;

    dispatch(action) {
      this.setState(prevState => reducer(prevState, action));
    }

    componentWillUnmount() {
      this._cancelValidations();
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
      this.dispatch({
        type: 'REGISTER_FIELD',
        key,
        label,
        value,
        ...functions,
      });
      return this._validate();
    };

    /**
     * Registers the submit function
     *
     * @param {Function} onSubmit Submit function
     */
    registerSubmit = onSubmit => {
      this.submit = onSubmit;
    };

    /**
     * Handles client input
     *
     * @param {String} key Input name
     * @param {*} value New input value
     */
    handleChange = (key, value) => {
      this.dispatch({ type: 'CHANGE_FIELD_VALUE', key, value });
      return this._validate();
    };

    /**
     * Marks a field as touched
     *
     * @param {String} key Input name
     */
    handleTouch = key => {
      // Short circuit if the field is already touched
      if (this.state.fields.byId[key].meta.touched) {
        return;
      }

      this.dispatch({ type: 'TOUCH_FIELD', key });
      return this._validate();
    };

    /**
     * Marks all fields as touched
     */
    handleTouchAll = () => {
      this.dispatch({ type: 'TOUCH_ALL_FIELDS' });
      return this._validate();
    };

    /**
     * Adds a field error to the end of the array
     *
     * @param {String} key Input name
     * @param {String} error Error message
     */
    _addError = (key, error) => {
      this.dispatch({ type: 'ADD_ERROR', key, error });
    };

    /**
     * Cancels all asynchronous validations and clears cancel functions
     */
    _cancelValidations = () => {
      this.cancelFunctions.forEach(cancel => {
        cancel();
      });
      this.cancelFunctions = [];
    };

    /**
     * Validates the field values, returns a promise
     */
    _validate = () => {
      // keep update id to be able to cancel multiple validation calls
      const updateId = this.updateId < 1000 ? this.updateId + 1 : 0;
      this.updateId = updateId;

      // wait for react to update state
      return new Promise((resolve, reject) => {
        setImmediate(() => {
          // Short circuit if the validate function is called again
          if (updateId !== this.updateId) {
            debug('Validation skipped');
            return;
          }

          debug('Validation');

          const { fields } = this.state;
          const { byId, allIds } = fields;

          // cancel all running asynchronous validations
          this._cancelValidations();

          const allPromises = [];
          // errors contains all the synchronous errors
          const errors = allIds.reduce((acc, id) => {
            const field = byId[id];
            const promises = [];

            acc[id] = field.functions.validate.reduce((acc, validator) => {
              const res = validator(field, fields);
              promises.push(res);

              // Check whether the result value is a Promise (or Promise like)
              if (
                res instanceof Promise ||
                (typeof res === 'object' && typeof res.then === 'function')
              ) {
                // asynchronous errors are dispatched separately when they finish
                const { promise, cancel } = cancelable(res);

                this.cancelFunctions.push(cancel);

                promise
                  .then(error => {
                    // Validation passed if return value is undefined
                    if (error !== undefined) {
                      this._addError(id, error);
                    }
                  })
                  .catch(err => {
                    if (err.isCanceled) {
                      return;
                    }

                    throw err;
                  });
              } else if (res !== undefined) {
                acc.push(res);
              }

              return acc;
            }, []);

            allPromises.push(
              Promise.all(promises)
                .then(res => {
                  this.dispatch({
                    type: 'VALIDATION_FIELD_DONE',
                    key: field.meta.key,
                  });
                })
                .catch(console.log)
            );

            return acc;
          }, {});

          this.dispatch({ type: 'SET_ERRORS', errors });

          Promise.all(allPromises)
            .then(resolve)
            .catch(reject);
        });
      });
    };

    /**
     * Resets the field to the initial state
     *
     * @param {String} key Field identifier
     */
    handleResetField = key => {
      this.dispatch({ type: 'RESET_FIELD', key });
    };

    /**
     * Resets the form to the initial state
     */
    handleResetForm = () => {
      this.dispatch({ type: 'RESET_ALL_FIELDS' });
    };

    /**
     * Handles submitting a form
     * Sets all fields to touched
     *
     * @param {Object} e Event
     */
    handleSubmit = async e => {
      e.preventDefault();

      await this.handleTouchAll();

      console.log('test');

      const { fields } = this.state;

      // Short circuit if any of the fields are invalid
      if (fields.allIds.some(id => fields.byId[id].meta.invalid)) {
        return;
      }

      // Pass in values {key: value}
      const fieldValues = fields.allIds.reduce((acc, fieldName) => {
        acc[fieldName] = fields.byId[fieldName].value;
        return acc;
      }, {});

      try {
        await this.submit(fieldValues, this.state);
      } catch (err) {
        if (err instanceof Error) {
          throw err;
        }

        this.setState(prevState => ({
          fields: prevState.allFields.reduce((acc, fieldName) => {
            const field = prevState.fields[fieldName];
            const errors =
              (err && err.fields && err.fields[fieldName]) ||
              prevState.fields[fieldName].errors;
            const valid = !errors.length;
            const invalid = !valid;

            acc[fieldName] = {
              ...field,
              errors,
              valid,
              invalid,
            };
            return acc;
          }, {}),
        }));
      }
    };

    /**
     * Context interface
     */
    getChildContext() {
      return {
        _form: {
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
        },
      };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  Form.childContextTypes = {
    _form: PropTypes.object,
  };

  return Form;
};

export default form;
