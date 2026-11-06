import java.util.Locale;
import java.util.Scanner;

public class NotasAlumnos {

    public static void main(String[] args) {
        final double NOTA_MIN = 0;
        final double NOTA_MAX = 10;
        final double FIN = -1;
        final double NOTA_APROBADO = 5;

        Scanner teclado = new Scanner(System.in);
        teclado.useLocale(Locale.US); // para poder escribir las notas con punto (7.5)

        int alumnos = 0;
        int aprobados = 0;
        int suspensos = 0;
        double suma = 0;
        double maxima = NOTA_MIN; // cualquier nota valida sera >= 0
        double minima = NOTA_MAX; // cualquier nota valida sera <= 10
        double nota;

        System.out.print("Nota (-1 para acabar): ");
        nota = teclado.nextDouble();

        while (nota != FIN) {
            if (nota < NOTA_MIN || nota > NOTA_MAX) {
                System.out.println("Nota no válida");
            } else {
                alumnos++;
                suma = suma + nota;

                if (nota > maxima) {
                    maxima = nota;
                }
                if (nota < minima) {
                    minima = nota;
                }

                if (nota >= NOTA_APROBADO) {
                    aprobados++;
                } else {
                    suspensos++;
                }
            }

            System.out.print("Nota (-1 para acabar): ");
            nota = teclado.nextDouble();
        }

        if (alumnos == 0) {
            System.out.println("No hay notas");
        } else {
            double media = suma / alumnos;
            double porcAprobados = aprobados * 100.0 / alumnos;
            double porcSuspensos = suspensos * 100.0 / alumnos;

            System.out.println("Alumnos: " + alumnos);
            System.out.printf(Locale.US, "Media: %.2f%n", media);
            System.out.println("Máxima: " + maxima + "  Mínima: " + minima);
            System.out.printf(Locale.US, "Aprobados: %d (%.2f%%)  Suspensos: %d (%.2f%%)%n",
                    aprobados, porcAprobados, suspensos, porcSuspensos);
        }

        teclado.close();
    }
}
