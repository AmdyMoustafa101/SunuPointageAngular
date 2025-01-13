import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, SideNavComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  selectedLanguage: string = 'fr';
  selectedTheme: string = 'light';
  notificationsEnabled: boolean = true;

  ngOnInit(): void {
    this.applyTheme(this.selectedTheme);
  }

  changeLanguage() {
    // Logique pour changer la langue
    console.log('Langue sélectionnée:', this.selectedLanguage);
  }

  changeTheme() {
    this.applyTheme(this.selectedTheme);
    console.log('Thème sélectionné:', this.selectedTheme);
  }

  toggleNotifications() {
    // Logique pour activer/désactiver les notifications
    console.log('Notifications activées:', this.notificationsEnabled);
  }

  applyTheme(theme: string): void {
    // Supprimez les classes de thème existantes
    document.body.classList.remove('light-theme', 'dark-theme');
    // Ajoutez la nouvelle classe de thème
    document.body.classList.add(`${theme}-theme`);
  }
}