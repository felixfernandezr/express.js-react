import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  nombre: yup.string().required('El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  lugar: yup.string().required('El lugar es obligatorio').max(100, 'Máximo 100 caracteres'),
  fecha: yup.date().required('La fecha es obligatoria').min(new Date(), 'La fecha debe ser futura'),
  organizador: yup.string().required('El organizador es obligatorio').max(50, 'Máximo 50 caracteres'),
  contacto: yup.string().required('El mail es obligatorio').email('Email incorrecto'),
});

function FormularioEvento({ evento, onSubmit, onCancelar }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: evento || {},
  });

  const enviar = (data) => onSubmit(data);

  return (
    <form onSubmit={handleSubmit(enviar)}>
      <h2>{evento ? 'Editar evento' : 'Crear evento'}</h2>
      <div className="form-group">
        <label htmlFor="nombre">Nombre:</label>
        <input
          defaultValue={evento?.nombre || 'Fiesta de fin de año'}
          {...register("nombre")}
          className={'form-control'}
        />
        {errors.nombre && <small className={'text-danger'}>{errors.nombre.message}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="lugar">Lugar:</label>
        <input
          defaultValue={evento?.lugar || 'Paraguay 1338, CABA'}
          {...register("lugar")}
          className={'form-control'}
        />
        {errors.lugar && <small className={'text-danger'}>{errors.lugar.message}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="fecha">Fecha:</label>
        <input type="date" {...register("fecha")} className={'form-control'} defaultValue={evento?.fecha?.toISOString().split('T')[0] || '2023-12-31T21:00:00'} />
        {errors.fecha && <small className={'text-danger'}>{errors.fecha.message}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="organizador">Organizador:</label>
        <input
          defaultValue={evento?.organizador || 'Ubaldo Carlos Estrada Saenz'}
          {...register("organizador")}
          className={'form-control'}
        />
        {errors.organizador && <small className={'text-danger'}>{errors.organizador.message}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="contacto">Contacto:</label>
        <input
          defaultValue={evento?.contacto || 'uces@gmail.com'} 
          {...register("contacto")}
          className={'form-control'}
        />
        {errors.contacto && <small className={'text-danger'}>{errors.contacto.message}</small>}
      </div>
      <button type="submit" className={'btn btn-primary'}>Guardar</button>
      <button type="button" onClick={onCancelar}>Cancelar</button>
    </form>
  );
}

export default FormularioEvento;
