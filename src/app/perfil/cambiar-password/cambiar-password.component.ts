import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel
  ],
  styleUrl: './cambiar-password.component.css'
})
export class CambiarPasswordComponent implements OnInit{
  passwordForm:FormGroup;
  username:string;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CambiarPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.username = data.username;
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }


  ngOnInit(): void {
  }

  public cambiarPassword(): void {
    if (this.passwordForm.valid) {
      const { password, newPassword } = this.passwordForm.value;
      this.authService.changePassword(this.username, password, newPassword).subscribe({
        next: (result) => {
          this.showSnackbar('Contraseña actualizada correctamente', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña:', err);
          const errorMessage = err.error.mensaje || 'Error desconocido';

          // Mostrar el mensaje de error en el snackbar, igual que en el login
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000,  // Duración en milisegundos
            verticalPosition: 'top',  // Posición vertical
            horizontalPosition: 'center',  // Posición horizontal
            panelClass: ['snack-error']  // Clase personalizada para el error
          });
        }
      });
    } else {
      this.showSnackbar('Por favor, completa todos los campos correctamente', 'Cerrar');
    }
  }


  cancelar(): void {
    this.dialogRef.close();
  }

  // Método para mostrar el Snackbar
  private showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,  // Duración en milisegundos
      verticalPosition: 'top',  // Posición vertical
      horizontalPosition: 'center',  // Posición horizontal
    });
  }
}
