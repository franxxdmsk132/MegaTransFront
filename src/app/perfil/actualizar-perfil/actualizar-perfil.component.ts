import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {TokenService} from '../../service/token.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-actualizar-perfil',
  templateUrl: './actualizar-perfil.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatInput,
    MatDialogTitle,
    MatLabel
  ],
  styleUrl: './actualizar-perfil.component.css'
})
export class ActualizarPerfilComponent implements OnInit {
  usuarioForm: FormGroup;
  username!: String;

  constructor(
    public dialogRef: MatDialogRef<ActualizarPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private cdRef:ChangeDetectorRef,
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      identificacion: ['', Validators.required],
      telefono: ['', Validators.required],
    });
    this.route.params.subscribe(params => {
      this.username = params['username'];
    });
  }
  actualizarUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      console.log('Datos a enviar:', usuarioData);  // Verifica los datos antes de enviarlos
      this.authService.actualizarUsuario(this.username, usuarioData).subscribe({
        next: (response) => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });

          // Actualizar localStorage después de la respuesta exitosa
          localStorage.setItem('AuthFullName', this.usuarioForm.value.nombre + ' ' + this.usuarioForm.value.apellido);
          localStorage.setItem('AuthIdentificacion', this.usuarioForm.value.identificacion);
          localStorage.setItem('AuthTelefono', this.usuarioForm.value.telefono);

          // También puedes actualizar el sessionStorage si lo estás utilizando
          sessionStorage.setItem('AuthFullName', this.usuarioForm.value.nombre + ' ' + this.usuarioForm.value.apellido);
          sessionStorage.setItem('AuthIdentificacion', this.usuarioForm.value.identificacion);
          sessionStorage.setItem('AuthTelefono', this.usuarioForm.value.telefono);

          // Forzar la actualización de la vista
          this.cdRef.detectChanges();

          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }




  cancelar() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.username = this.tokenService.getUserName();
    console.log("Username en ngOnInit: ", this.username);

    if (this.data) {
      this.usuarioForm.patchValue({
        nombre: this.data.nombre,
        apellido: this.data.apellido,
        identificacion: this.data.identificacion,
        telefono: this.data.telefono
      });
    }
  }

}
