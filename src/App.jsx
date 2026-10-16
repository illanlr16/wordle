import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'

const FILAS = 6
const SOLUCION = ['PERRO', 'MOVIL', 'DESIN', 'POCHO', 'MOCHI']
const COLUMNAS = 5

// Crea un tablero vacío: 6 filas de 5 letras en blanco
function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

// Añadimos una función para generar un número aleatorio y que la palabra del array sea aleatoria
function solucionAleatoria(){
  let i = Math.floor(Math.random() * SOLUCION.length)
  return SOLUCION[i]
}

// Decide el color de una letra ya comprobada
// Añadimos la palabra de la solución al estado
function estadoDe(letra, columna, palabra) {
  if (palabra[columna] === letra) return 'correcta'
  if (palabra.includes(letra)) return 'presente'
  return 'ausente'
}


function App() {
  // Declaramos la palabra
  const [palabra, setSolucion] = useState(solucionAleatoria)
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)
  // Declaramos el aviso por si faltan letras
  const [aviso, setAviso] = useState('')

  // El último intento comprobado, como texto: 'PERRO'
  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''

  // Comparamos con la palabra
  const ganada = ultimo === palabra
  const terminada = ganada || filaActual === FILAS

  // Funcion para vaciar el tablero mediante el botón "Volver a jugar", resetear la fila y los intentos
  function vaciarTablero(){
    setIntentos(tableroVacio())
    setFilaActual(0)

    // le añado el setter de la solucion aleatoria de la segunda mejora
    setSolucion(solucionAleatoria())
  }

  useEffect(() => {
    // Lleva el cursor a la primera casilla en la que se puede escribir
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
    // Solo aceptamos una letra, o nada si se ha borrado
    if (!/^[A-ZÑ]?$/.test(letra)) return

    // Copiamos el tablero, cambiamos la copia y la guardamos
    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)

    // Después de escribir una letra, pasamos a la casilla siguiente
    if (letra !== '') evento.target.nextElementSibling?.focus()
  }

  function comprobar(evento) {
    // Evita que el navegador recargue la página al enviar el formulario
    evento.preventDefault()
    if (terminada) return
    // No se puede comprobar una fila incompleta
    if (intentos[filaActual].includes('')){
      // Añadimos texto al aviso para indicar que faltan letras
      setAviso('Faltan letras')
      return
    }

    setFilaActual(filaActual + 1)
    // Si no faltan letras quitamos el aviso (en caso de que hubieran faltado previamente)
    setAviso('')
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {intentos.map((fila, f) => (
          <div className="fila" key={f}>
            {fila.map((letra, c) => (
              <Casilla
                key={c}
                letra={letra}
                // le pasamos palabra a estadoDe
                estado={f < filaActual ? estadoDe(letra, c, palabra) : ''}
                activa={f === filaActual && !terminada}
                onCambio={(evento) => cambiarLetra(f, c, evento)}
              />
            ))}
          </div>
        ))}
      </div>

      {/*Añadimos el aviso por pantalla*/}
      {aviso && <p role="alert">{aviso}</p>}

      {terminada ? (
        <>
          <p className="mensaje" role="status">
            {ganada
              ? '¡Enhorabuena, has acertado!' 
              // Si se falla devuelve la palabra que era
              : `La palabra era ${palabra}`}
          </p>

          {/*botón para vaciar el tablero y volver a jugá*/}
          <button onClick={vaciarTablero} className="boton" type="button">Volver a jugar</button>
        </>
      ) : (
        <button className="boton" type="submit">
          Comprobar
        </button>
      )}
    </form>
  )
}

export default App








