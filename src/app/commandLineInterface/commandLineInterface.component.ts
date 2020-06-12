import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-command-line-interface',
    templateUrl: './commandLineInterface.component.html'
})

export class CommandLineInterfaceComponent {
    @Output() acceptedCommand = new EventEmitter<any>();
    adminMode = false;
    wardenInput = '';
    wardenOutput = '';

    commandLineAI() {
      if (this.wardenInput.toLowerCase() === 'help') {
        this.wardenOutput = `
        List of available commands (enter without brackets):
        <p>[help]: displays list of available commands</p>
        <p>[trinket -g]: generates a random trinket</p>
        <p>[patch -g]: generates a random patch</p>
        <p>[crew -c]: generates a crew member manifest</p>
        <p>[mission_brief/# || "list"]: retrieve mission briefing. requires a brief number or "list" for list of mission_briefs`;
        this.acceptedCommand.emit('help');
      } else if (this.wardenInput.toLowerCase() === 'random' && this.adminMode) {
        this.wardenOutput = 'displaying random tables...';
        this.acceptedCommand.emit('random');
      } else if (this.wardenInput.toLowerCase() === 'mothership_admin_override') {
        this.wardenOutput = 'admin recognized.';
        this.acceptedCommand.emit('admin');
        this.adminMode = true;
      } else if (this.wardenInput.toLowerCase() === 'trinket -g') {
        this.wardenOutput = 'generating random trinket...';
        this.acceptedCommand.emit('trinket -g');
      } else if (this.wardenInput.toLowerCase() === 'patch -g') {
        this.wardenOutput = 'generating random patch...';
        this.acceptedCommand.emit('patch -g');
      } else if (this.wardenInput.toLowerCase() === 'crew -c') {
        this.wardenOutput = 'retrieving crew member manifest...';
        this.acceptedCommand.emit('crew -c');
      } else if (this.wardenInput.toLowerCase().includes('mission_brief/')) {
        this.wardenOutput = 'retrieving mission briefing...';
        this.acceptedCommand.emit(this.wardenInput.toLowerCase());
      } else {
        this.wardenOutput = `command "${this.wardenInput}" not recognized`;
      }
      this.wardenInput = '';
    }
}
