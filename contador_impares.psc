Algoritmo ContadorImpares
	Escribir "Dime un numero:"
	Leer n
	contador <- 0
	Para i <- 1 Hasta n Hacer
		Si i MOD 2 = 1 Entonces
			contador <- contador + 1
		FinSi
	FinPara
	Escribir "Hay ", contador, " impares"
FinAlgoritmo
