/**
 * Compact, accessible contact-form wizard.
 * The complete form stays in the HTML for Netlify Forms and no-JS fallback.
 */
document.addEventListener('DOMContentLoaded', () => {
  const wizard = document.querySelector('[data-contact-wizard]');
  const form = document.querySelector('form[name="contact"]');

  if (!wizard || !form) return;

  const steps = [...wizard.querySelectorAll('[data-wizard-step]')];
  const progressItems = [...wizard.querySelectorAll('[data-progress-step]')];
  const nextButtons = [...wizard.querySelectorAll('[data-wizard-next]')];
  const backButtons = [...wizard.querySelectorAll('[data-wizard-back]')];
  const symptomInputs = [...wizard.querySelectorAll('input[name="symptom"]')];
  const service = form.elements.namedItem('service');
  const message = form.elements.namedItem('message');
  const count = wizard.querySelector('[data-char-count]');
  const status = wizard.querySelector('.status-message');
  const symptomSummary = wizard.querySelector('[data-symptom-summary]');

  const serviceMap = {
    'The website needs work': 'Website Redesign',
    'We need better leads': 'Lead Generation System',
    'Follow-up is manual': 'Workflow Automation',
    'We do not know what is working': 'Not Sure Yet',
    'We need a complete system': 'Not Sure Yet',
  };

  let currentStepIndex = 0;

  const setStatus = (text = '') => {
    if (status) status.textContent = text;
  };

  const updateProgress = () => {
    progressItems.forEach((item, index) => {
      const isCurrent = index === currentStepIndex;
      const isComplete = index < currentStepIndex;

      item.classList.toggle('is-current', isCurrent);
      item.classList.toggle('is-complete', isComplete);

      if (isCurrent) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  };

  const showStep = (nextIndex, { focusHeading = true, scroll = true } = {}) => {
    currentStepIndex = Math.max(0, Math.min(nextIndex, steps.length - 1));

    steps.forEach((step, index) => {
      const isCurrent = index === currentStepIndex;
      step.hidden = !isCurrent;
      step.inert = !isCurrent;
    });

    updateProgress();
    setStatus('');

    const activeStep = steps[currentStepIndex];
    const heading = activeStep?.querySelector('.wizard-step-heading');

    if (focusHeading && heading) {
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }

    if (scroll && window.matchMedia('(max-width: 850px)').matches) {
      wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const firstInvalidControl = (scope) =>
    [...scope.querySelectorAll('input, select, textarea')].find(
      (control) => !control.disabled && !control.checkValidity(),
    );

  const validateStep = (step) => {
    const invalidControl = firstInvalidControl(step);

    if (!invalidControl) return true;

    setStatus('Please complete the highlighted field before continuing.');
    invalidControl.reportValidity();
    invalidControl.focus({ preventScroll: false });
    return false;
  };

  const updateSymptom = () => {
    const selected = symptomInputs.find((input) => input.checked);
    if (!selected) return;

    if (service instanceof HTMLSelectElement) {
      service.value = serviceMap[selected.value] || 'Not Sure Yet';
    }

    if (symptomSummary) {
      symptomSummary.textContent = `Selected bottleneck: ${selected.value}.`;
    }
  };

  const updateCharacterCount = () => {
    if (!(message instanceof HTMLTextAreaElement) || !count) return;
    count.textContent = `${message.value.length} / ${message.maxLength}`;
  };

  wizard.classList.add('is-enhanced');
  showStep(0, { focusHeading: false, scroll: false });

  symptomInputs.forEach((input) => input.addEventListener('change', updateSymptom));

  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentStep = steps[currentStepIndex];
      if (currentStep && validateStep(currentStep)) showStep(currentStepIndex + 1);
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener('click', () => showStep(currentStepIndex - 1));
  });

  if (message instanceof HTMLTextAreaElement) {
    message.addEventListener('input', updateCharacterCount);
    updateCharacterCount();
  }

  form.addEventListener(
    'invalid',
    (event) => {
      const invalidControl = event.target;
      if (!(invalidControl instanceof HTMLElement)) return;

      const invalidStep = invalidControl.closest('[data-wizard-step]');
      const invalidStepIndex = steps.indexOf(invalidStep);

      if (invalidStepIndex >= 0 && invalidStepIndex !== currentStepIndex) {
        showStep(invalidStepIndex, { focusHeading: false });
      }

      setStatus('Please complete the highlighted field before sending.');
    },
    true,
  );

  form.addEventListener('submit', (event) => {
    const invalidControl = firstInvalidControl(form);

    if (invalidControl) {
      event.preventDefault();

      const invalidStep = invalidControl.closest('[data-wizard-step]');
      const invalidStepIndex = steps.indexOf(invalidStep);

      if (invalidStepIndex >= 0) {
        showStep(invalidStepIndex, { focusHeading: false });
      }

      setStatus('Please complete the highlighted field before sending.');
      requestAnimationFrame(() => {
        invalidControl.reportValidity();
        invalidControl.focus({ preventScroll: false });
      });
      return;
    }

    setStatus('Sending your project inquiry…');
  });
});
