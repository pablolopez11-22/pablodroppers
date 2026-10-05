// Contador de impares
// El usuario introduce un numero N y el programa dice
// cuantos numeros impares hay entre 1 y N (ambos incluidos).

Algoritmo ContadorImpares
	Definir n, i, cantidad Como Entero

	Escribir "Introduce un numero:"
	Leer n

	cantidad <- 0
	Para i <- 1 Hasta n Con Paso 1 Hacer
		Si i MOD 2 <> 0 Entonces
			cantidad <- cantidad + 1
		FinSi
	FinPara

	Escribir "Entre 1 y ", n, " hay ", cantidad, " numeros impares."
FinAlgoritmo
