/**
 * Fichier : js/features/midi/midiController.js
 * Rôle : coordonner le service Midi.
 *
 * Ce contrôleur ne contient ni validation métier,
 * ni gestion de liste MyPos, ni accès direct à Supabase.
 */

import midiView from './midiView.js';
import { createMyPosPayments } from './myPosPayments.js';
import { createMidiRecap } from './midiRecap.js';
import { setupEnterNavigation } from '../../utils/formNavigation.js';
import {
  validateMidiRawData,
  buildMidiClosingData,
} from '../../validation/midiValidation.js';
import {
  saveDailyClosing,
  closeDailyClosing,
} from '../../services/dailyClosingService.js';

const midiController = {
  init() {
    midiView.init();

    this.myPos = createMyPosPayments({
      amountInput: midiView.elements.myPosAmount,
      addButton: midiView.elements.myPosAddButton,
      listElement: midiView.elements.myPosList,
      totalElement: midiView.elements.myPosTotal,
      onChange: () => this.updateRecap(),
    });

    this.recap = createMidiRecap([
      {
        element: midiView.elements.recapMyPos,
        dataKey: 'myPosTotal',
        type: 'currency',
      },
      {
        element: midiView.elements.recapCbClassic,
        dataKey: 'cbClassic',
        type: 'currency',
      },
      {
        element: midiView.elements.recapCbTicketResto,
        dataKey: 'cbTicketResto',
        type: 'currency',
      },
      {
        element: midiView.elements.recapCashAdipos,
        dataKey: 'cashAdipos',
        type: 'currency',
      },
      {
        element: midiView.elements.recapAncvPaper,
        dataKey: 'ancvPaper',
        type: 'currency',
      },
      {
        element: midiView.elements.recapAncvConnect,
        dataKey: 'ancvConnect',
        type: 'currency',
      },
      {
        element: midiView.elements.recapChecks,
        dataKey: 'checks',
        type: 'currency',
      },
      {
        element: midiView.elements.recapVat55,
        dataKey: 'vat55',
        type: 'currency',
      },
      {
        element: midiView.elements.recapVat10,
        dataKey: 'vat10',
        type: 'currency',
      },
      {
        element: midiView.elements.recapVat20,
        dataKey: 'vat20',
        type: 'currency',
      },
      {
        element: midiView.elements.recapPizzasDineIn,
        dataKey: 'pizzasDineIn',
        type: 'integer',
      },
      {
        element: midiView.elements.recapPizzasTakeaway,
        dataKey: 'pizzasTakeaway',
        type: 'integer',
      },
    ]);

    setupEnterNavigation(
      midiView.elements.form,
      midiView.elements.myPosAmount,
    );

    midiView.elements.form.addEventListener('input', () => {
      this.updateRecap();
    });

    midiView.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleValidate();
    });

    midiView.elements.modifyButton.addEventListener('click', () => {
      this.handleModify();
    });

    midiView.setLocked(false);
    this.updateRecap();
  },

  getBusinessDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },

  getRawMidiData() {
    return {
      myPosTotal: this.myPos.getTotal(),
      cbClassic: midiView.getRawValue(midiView.elements.cbClassic),
      cbTicketResto: midiView.getRawValue(midiView.elements.cbTicketResto),
      cashAdipos: midiView.getRawValue(midiView.elements.cashAdipos),
      ancvPaper: midiView.getRawValue(midiView.elements.ancvPaper),
      ancvConnect: midiView.getRawValue(midiView.elements.ancvConnect),
      checks: midiView.getRawValue(midiView.elements.checks),
      vat55: midiView.getRawValue(midiView.elements.vat55),
      vat10: midiView.getRawValue(midiView.elements.vat10),
      vat20: midiView.getRawValue(midiView.elements.vat20),
      pizzasDineIn: midiView.getRawValue(midiView.elements.pizzasDineIn),
      pizzasTakeaway: midiView.getRawValue(midiView.elements.pizzasTakeaway),
    };
  },

  updateRecap() {
    midiView.clearMessage();

    const validation = validateMidiRawData(this.getRawMidiData());

    if (validation.isValid) {
      this.recap.update(validation.data);
    }
  },

  async handleValidate() {
    midiView.clearMessage();

    const validation = validateMidiRawData(this.getRawMidiData());

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      midiView.showMessage(firstError, 'error');
      return;
    }

    const closingData = buildMidiClosingData(validation.data);

    try {
      midiView.showMessage('Enregistrement du Midi en cours…', 'info');

      await saveDailyClosing(this.getBusinessDate(), 'midi', closingData);
      await closeDailyClosing(this.getBusinessDate(), 'midi');

      midiView.setLocked(true);
      midiView.showMessage(
        'Midi enregistré et validé dans Supabase.',
        'success',
      );
    } catch (error) {
      midiView.setLocked(false);
      midiView.showMessage(error.message, 'error');
    }
  },

  handleModify() {
    midiView.setLocked(false);
    midiView.showMessage('Modification du Midi ouverte.', 'info');
  },
};

export default midiController;