import { expect } from 'chai';
import reducer from './reducer';
import * as actions from './actions';

describe('reducer', () => {
  it('should set corretly the initial state', async () => {
    const state = reducer(undefined, {});

    expect(state).to.be.deep.equal({
      fields: {
        byId: {},
        allIds: [],
      },
      isRegistered: false,
    });
  });

  it('should register field', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const action = actions.registerField({
      key: 'field',
      label: 'Field',
      value: 'value',
      parse,
      transform,
      format,
      validate: [],
    });
    const state = reducer(undefined, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field'],
        byId: {
          field: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should register submit function', () => {
    const action = actions.registerSubmit();
    const state = reducer(undefined, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: [],
        byId: {},
      },
      isRegistered: true,
    });
  });

  it('should change field value', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = actions.registerField({
      key: 'field',
      label: 'Field',
      value: 'value',
      parse,
      transform,
      format,
      validate: [],
    });
    const stateWithField = reducer(undefined, actionRegisterField);

    const action = actions.changeField('field', 'wohoo');
    const state = reducer(stateWithField, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field'],
        byId: {
          field: {
            value: 'wohoo -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field',
              label: 'Field',
              pristine: false,
              dirty: true,
              touched: true,
              untouched: false,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should mark field as touched', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = actions.registerField({
      key: 'field',
      label: 'Field',
      value: 'value',
      parse,
      transform,
      format,
      validate: [],
    });
    const stateWithField = reducer(undefined, actionRegisterField);

    const action = actions.touchField('field');
    const state = reducer(stateWithField, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field'],
        byId: {
          field: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field',
              label: 'Field',
              pristine: false,
              dirty: true,
              touched: true,
              untouched: false,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should mark all fields as touched', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = key =>
      actions.registerField({
        key,
        label: 'Field',
        value: 'value',
        parse,
        transform,
        format,
        validate: [],
      });
    const stateWithField = reducer(undefined, actionRegisterField('field1'));
    const stateWithTwoFields = reducer(
      stateWithField,
      actionRegisterField('field2')
    );

    const action = actions.touchFields();
    const state = reducer(stateWithTwoFields, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field1', 'field2'],
        byId: {
          field1: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field1',
              label: 'Field',
              pristine: false,
              dirty: true,
              touched: true,
              untouched: false,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
          field2: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field2',
              label: 'Field',
              pristine: false,
              dirty: true,
              touched: true,
              untouched: false,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should reset field to initial state', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = actions.registerField({
      key: 'field',
      label: 'Field',
      value: 'value',
      parse,
      transform,
      format,
      validate: [],
    });
    const stateWithField = reducer(undefined, actionRegisterField);

    const actionChangeField = actions.changeField('field', 'wohoo');
    const stateWithChangedField = reducer(stateWithField, actionChangeField);

    const action = actions.resetField('field');
    const state = reducer(stateWithChangedField, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field'],
        byId: {
          field: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should reset all fields to initial states', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = key =>
      actions.registerField({
        key,
        label: 'Field',
        value: 'value',
        parse,
        transform,
        format,
        validate: [],
      });
    const stateWithField = reducer(undefined, actionRegisterField('field1'));
    const stateWithTwoFields = reducer(
      stateWithField,
      actionRegisterField('field2')
    );

    const actionChangeField1 = actions.changeField('field1', 'field-1-wohoo');
    const stateWithChangedField1 = reducer(
      stateWithTwoFields,
      actionChangeField1
    );

    const actionChangeField2 = actions.changeField('field2', 'field-2-wohoo');
    const stateWithChangedFields = reducer(
      stateWithChangedField1,
      actionChangeField2
    );

    const action = actions.resetFields();
    const state = reducer(stateWithChangedFields, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field1', 'field2'],
        byId: {
          field1: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field1',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
          field2: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field2',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should mark all fields as validating', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = key =>
      actions.registerField({
        key,
        label: 'Field',
        value: 'value',
        parse,
        transform,
        format,
        validate: [],
      });
    const stateWithField = reducer(undefined, actionRegisterField('field1'));
    const stateWithTwoFields = reducer(
      stateWithField,
      actionRegisterField('field2')
    );

    const action = actions.setValidating();
    const state = reducer(stateWithTwoFields, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field1', 'field2'],
        byId: {
          field1: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field1',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: true,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
          field2: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field2',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: true,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should add errors to a field', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = actions.registerField({
      key: 'field',
      label: 'Field',
      value: 'value',
      parse,
      transform,
      format,
      validate: [],
    });
    const stateWithField = reducer(undefined, actionRegisterField);

    const actionAddError1 = actions.addError('field', 'Is required!');
    const stateWithError1 = reducer(stateWithField, actionAddError1);

    const actionAddError2 = actions.addError(
      'field',
      'Minimal length is 5 characters!'
    );
    const state = reducer(stateWithError1, actionAddError2);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field'],
        byId: {
          field: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: false,
              invalid: true,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: ['Is required!', 'Minimal length is 5 characters!'],
          },
        },
      },
      isRegistered: false,
    });
  });

  it('should mark field as not validating', () => {
    const parse = val => `${val} -> parsed`;
    const transform = val => `${val} -> transformed`;
    const format = val => `${val} -> formatted`;

    const actionRegisterField = key =>
      actions.registerField({
        key,
        label: 'Field',
        value: 'value',
        parse,
        transform,
        format,
        validate: [],
      });
    const stateWithField = reducer(undefined, actionRegisterField('field1'));
    const stateWithTwoFields = reducer(
      stateWithField,
      actionRegisterField('field2')
    );

    const actionSetValidating = actions.setValidating();
    const stateWithValidating = reducer(
      stateWithTwoFields,
      actionSetValidating
    );

    const action = actions.fieldValidationDone('field1');
    const state = reducer(stateWithValidating, action);

    expect(state).to.be.deep.equal({
      fields: {
        allIds: ['field1', 'field2'],
        byId: {
          field1: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field1',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: false,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
          field2: {
            value: 'value -> parsed -> transformed',
            initialValue: 'value -> parsed -> transformed',
            meta: {
              key: 'field2',
              label: 'Field',
              pristine: true,
              dirty: false,
              touched: false,
              untouched: true,
              valid: true,
              invalid: false,
              validating: true,
            },
            functions: {
              format,
              parse,
              transform,
              validate: [],
            },
            errors: [],
          },
        },
      },
      isRegistered: false,
    });
  });
});
