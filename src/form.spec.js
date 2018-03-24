import React from 'react';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { mount } from 'enzyme';
import form from './form';
import { isRequired, minimumLength } from './validators/index';

chai.use(dirtyChai);

process.on('unhandledRejection', (reason, promise) => console.log({ reason }));

const dumbComponent = () => <div />;
const MyForm = form(dumbComponent);
const mockFunction = val => val;

describe('form HOC', () => {
  it('should register a field', () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();
    const { byId, allIds } = component.state.fields;

    expect(byId)
      .to.be.an('object')
      .that.is.empty();
    expect(allIds)
      .to.be.an('array')
      .that.is.empty();

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    const { byId: newById, allIds: newAllIds } = component.state.fields;

    expect(newById).to.deep.equal({
      input: {
        value: '',
        initialValue: '',
        meta: {
          key: 'input',
          label: 'Input',
          pristine: true,
          dirty: false,
          touched: false,
          untouched: true,
          valid: true,
          invalid: false,
          validating: false,
        },
        functions: {
          parse: mockFunction,
          transform: mockFunction,
          format: mockFunction,
          validate: [],
        },
        errors: [],
      },
    });
    expect(newAllIds).to.deep.equal(['input']);
  });

  it('should change value of field', () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.handleChange('input', 'value');

    const { byId, allIds } = component.state.fields;

    expect(byId).to.deep.equal({
      input: {
        value: 'value',
        initialValue: '',
        meta: {
          key: 'input',
          label: 'Input',
          pristine: false,
          dirty: true,
          touched: true,
          untouched: false,
          valid: true,
          invalid: false,
          validating: false,
        },
        functions: {
          parse: mockFunction,
          transform: mockFunction,
          format: mockFunction,
          validate: [],
        },
        errors: [],
      },
    });
    expect(allIds).to.deep.equal(['input']);
  });

  it('should mark field as touched', () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.registerField('input2', 'Input 2', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.handleTouch('input');

    const { byId } = component.state.fields;

    expect(byId.input).to.deep.equal({
      value: '',
      initialValue: '',
      meta: {
        key: 'input',
        label: 'Input',
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });

    expect(byId.input2).to.deep.equal({
      value: '',
      initialValue: '',
      meta: {
        key: 'input2',
        label: 'Input 2',
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });
  });

  it('should reset field', () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();

    component.registerField('input', 'Input', 'sample', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.registerField('input2', 'Input 2', 'initial value', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.handleChange('input', 'new value');
    component.handleChange('input2', 'changed value');
    component.handleResetField('input');

    const { byId } = component.state.fields;

    expect(byId.input).to.deep.equal({
      value: 'sample',
      initialValue: 'sample',
      meta: {
        key: 'input',
        label: 'Input',
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });

    expect(byId.input2).to.deep.equal({
      value: 'changed value',
      initialValue: 'initial value',
      meta: {
        key: 'input2',
        label: 'Input 2',
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });
  });

  it('should reset all fields', () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.registerField('input2', 'Input 2', 'initial value', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.handleChange('input', 'new value');
    component.handleChange('input2', 'changed value');
    component.handleResetForm();

    const { byId } = component.state.fields;

    expect(byId.input).to.deep.equal({
      value: '',
      initialValue: '',
      meta: {
        key: 'input',
        label: 'Input',
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });

    expect(byId.input2).to.deep.equal({
      value: 'initial value',
      initialValue: 'initial value',
      meta: {
        key: 'input2',
        label: 'Input 2',
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });
  });

  it('should mark all fields as touched', () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.registerField('input2', 'Input 2', 'initial value', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [],
    });

    component.handleTouchAll();

    const { byId } = component.state.fields;

    expect(byId.input).to.deep.equal({
      value: '',
      initialValue: '',
      meta: {
        key: 'input',
        label: 'Input',
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });

    expect(byId.input2).to.deep.equal({
      value: 'initial value',
      initialValue: 'initial value',
      meta: {
        key: 'input2',
        label: 'Input 2',
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
        valid: true,
        invalid: false,
        validating: false,
      },
      functions: {
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: [],
      },
      errors: [],
    });
  });

  it('should fail validation rules', async () => {
    const wrapper = mount(<MyForm />);
    const component = wrapper.instance();

    const required = isRequired('Required');
    const minLength = minimumLength('Must be at least 3 characters long', 3);

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [required, minLength],
    });

    await component.handleTouch('input');

    const { byId } = component.state.fields;

    return Promise.resolve().then(() => {
      expect(byId.input).to.deep.equal({
        value: '',
        initialValue: '',
        meta: {
          key: 'input',
          label: 'Input',
          pristine: false,
          dirty: true,
          touched: true,
          untouched: false,
          valid: false,
          invalid: true,
          validating: false,
        },
        functions: {
          parse: mockFunction,
          transform: mockFunction,
          format: mockFunction,
          validate: [required, minLength],
        },
        errors: ['Required', 'Must be at least 3 characters long'],
      });
    });
  });
});
