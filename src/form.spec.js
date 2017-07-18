import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import form from './form'
import { isRequired, minimumLength } from './validators/index'

const dumbComponent = () => <div />
const MyForm = form(dumbComponent)
const mockFunction = (val) => val

describe('form HOC', () => {
  it('should register a field', (done) => {
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    expect({}).to.be.an('object').that.is.empty()
    expect([]).to.be.an('array').that.is.empty()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    expect(component.state.fields).to.be.an('object')
    expect(component.state.fields).to.have.property('input').that.is.an('object')
    expect(component.state.fields).to.deep.equal({
      input: {
        name: 'input',
        label: 'Input',
        value: '',
        initialValue: '',
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
        valid: true,
        invalid: false,
        errors: [],
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: []
      }
    })
    expect(component.state.allFields).to.be.an('array')
    expect(component.state.allFields).to.have.members(['input'])

    done()
  })

  it('should change value of field', (done) => {
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.handleChange('input', 'value')

    expect(component.state.fields).to.deep.equal({
      input: {
        name: 'input',
        label: 'Input',
        value: 'value',
        initialValue: '',
        pristine: false,
        dirty: true,
        touched: false,
        untouched: true,
        valid: true,
        invalid: false,
        errors: [],
        parse: mockFunction,
        transform: mockFunction,
        format: mockFunction,
        validate: []
      }
    })

    done()
  })

  it('should mark field as touched', (done) => {
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.registerField('input2', 'Input 2', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.handleTouch('input')

    expect(component.state.fields.input).to.deep.equal({
      name: 'input',
      label: 'Input',
      value: '',
      initialValue: '',
      pristine: false,
      dirty: true,
      touched: true,
      untouched: false,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    done()
  })

  it('should reset field', (done) => {
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.registerField('input2', 'Input 2', 'initial value', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.handleChange('input', 'new value')
    component.handleChange('input2', 'changed value')
    component.handleResetField('input')

    expect(component.state.fields.input).to.deep.equal({
      name: 'input',
      label: 'Input',
      value: '',
      initialValue: '',
      pristine: true,
      dirty: false,
      touched: false,
      untouched: true,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })
    expect(component.state.fields.input2).to.deep.equal({
      name: 'input2',
      label: 'Input 2',
      value: 'changed value',
      initialValue: 'initial value',
      pristine: false,
      dirty: true,
      touched: false,
      untouched: true,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    done()
  })

  it('should reset all fields', (done) => {
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.registerField('input2', 'Input 2', 'initial value', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.handleChange('input', 'new value')
    component.handleChange('input 2', 'changed value')
    component.handleResetForm()

    expect(component.state.fields.input).to.deep.equal({
      name: 'input',
      label: 'Input',
      value: '',
      initialValue: '',
      pristine: true,
      dirty: false,
      touched: false,
      untouched: true,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })
    expect(component.state.fields.input2).to.deep.equal({
      name: 'input2',
      label: 'Input 2',
      value: 'initial value',
      initialValue: 'initial value',
      pristine: true,
      dirty: false,
      touched: false,
      untouched: true,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    done()
  })

  it('should mark all fields as touched', async (done) => {
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.registerField('input2', 'Input 2', 'initial value', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })

    component.handleChange('input', 'new value')
    component.handleChange('input2', 'changed value')

    try {
      await component.setAllTouched()
    } catch (err) {
      done(err)
    }

    expect(component.state.fields.input).to.deep.equal({
      name: 'input',
      label: 'Input',
      value: 'new value',
      initialValue: '',
      pristine: false,
      dirty: true,
      touched: true,
      untouched: false,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })
    expect(component.state.fields.input2).to.deep.equal({
      name: 'input2',
      label: 'Input 2',
      value: 'changed value',
      initialValue: 'initial value',
      pristine: false,
      dirty: true,
      touched: true,
      untouched: false,
      valid: true,
      invalid: false,
      errors: [],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: []
    })
    done()
  })

  it('should fail validation rules', async () => {
    const required = isRequired('required')
    const minLength = minimumLength('min length is 3', 3)
    const wrapper = mount(<MyForm />)
    const component = wrapper.instance()

    component.registerField('input', 'Input', '', {
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [required, minLength]
    })

    console.log('BEFORE TOUCH')
    component.handleTouch('input')

    expect(component.state.fields.input).to.deep.equal({
      name: 'input',
      label: 'Input',
      value: 'new value',
      initialValue: '',
      pristine: false,
      dirty: true,
      touched: true,
      untouched: false,
      valid: false,
      invalid: true,
      errors: ['required', 'min length is 3'],
      parse: mockFunction,
      transform: mockFunction,
      format: mockFunction,
      validate: [required, minLength]
    })
  })
})
