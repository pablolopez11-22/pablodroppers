// Contador de impares
// El usuario introduce un numero N y el programa dice directamente
// cuantos numeros impares hay entre 1 y N (ambos incluidos).

Algoritmo ContadorImpares
	Definir n, cantidad Como Entero

	Escribir "Introduce un numero:"
	Leer n

	Si n < 1 Entonces
		cantidad <- 0
	SiNo
		// Entre 1 y N hay (N + 1) / 2 impares (division entera)
		cantidad <- trunc((n + 1) / 2)
	FinSi

	Escribir "Entre 1 y ", n, " hay ", cantidad, " numeros impares."
FinAlgoritmo
