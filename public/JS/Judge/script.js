// Configuration
    const defaultConfig = {
      primary_color: '#1E40AF',
      confirm_color: '#0891B2',
      error_color: '#DC2626',
      warning_color: '#F59E0B',
      success_color: '#16A34A',
      app_title: 'Nyaay Drishti',
      judge_info: 'Justice Sharma | Court #3 | 23 Dec 2025',
      current_case_header: 'CURRENT CASE (In Progress)',
      case_number: '27834 - Criminal Bail Application',
      petitioner_name: 'Ram Kumar (32, unemployed)',
      control_header: 'JUDGE CONTROL - EXTEND SESSION?',
      ripple_header: 'RIPPLE EFFECT PREVIEW',
      confirm_button: 'CONFIRM EXTENSION - NOTIFY ALL',
      cancel_button: 'CANCEL - CASE ENDS NOW'
    };

    // Initialize Element SDK
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
          const primaryColor = config.primary_color || defaultConfig.primary_color;
          const confirmColor = config.confirm_color || defaultConfig.confirm_color;
          const errorColor = config.error_color || defaultConfig.error_color;

          // Apply colors
          document.querySelector('.dashboard-header').style.background = primaryColor;
          document.querySelector('.control-header').style.borderBottomColor = primaryColor;
          
          document.querySelectorAll('.radio-option.selected').forEach(el => {
            el.style.borderColor = primaryColor;
          });
          
          document.querySelectorAll('.radio-option.selected .radio-circle').forEach(el => {
            el.style.borderColor = primaryColor;
          });
          
          document.querySelectorAll('.radio-circle-inner').forEach(el => {
            el.style.background = primaryColor;
          });

          document.querySelector('.btn-confirm').style.background = confirmColor;
          document.querySelector('.current-case-section').style.borderLeftColor = errorColor;

          // Apply text content
          document.querySelector('.app-title').textContent = 
            config.app_title || defaultConfig.app_title;
          document.querySelector('.judge-info').textContent = 
            config.judge_info || defaultConfig.judge_info;
          document.querySelector('.section-badge').textContent = 
            config.current_case_header || defaultConfig.current_case_header;
          document.querySelector('.case-title').textContent = 
            'Case #' + (config.case_number || defaultConfig.case_number);
          
          const caseDetails = document.querySelectorAll('.case-detail');
          if (caseDetails[0]) {
            caseDetails[0].innerHTML = 
              `<strong>Petitioner:</strong> ${config.petitioner_name || defaultConfig.petitioner_name}`;
          }

          document.querySelector('.control-header').textContent = 
            config.control_header || defaultConfig.control_header;
          document.querySelector('.ripple-header').textContent = 
            '📱 ' + (config.ripple_header || defaultConfig.ripple_header);
          document.querySelector('.btn-confirm').textContent = 
            config.confirm_button || defaultConfig.confirm_button;
          document.querySelector('.btn-cancel').textContent = 
            config.cancel_button || defaultConfig.cancel_button;
        },
        mapToCapabilities: (config) => ({
          recolorables: [
            {
              get: () => config.primary_color || defaultConfig.primary_color,
              set: (value) => {
                config.primary_color = value;
                window.elementSdk.setConfig({ primary_color: value });
              }
            },
            {
              get: () => config.confirm_color || defaultConfig.confirm_color,
              set: (value) => {
                config.confirm_color = value;
                window.elementSdk.setConfig({ confirm_color: value });
              }
            },
            {
              get: () => config.error_color || defaultConfig.error_color,
              set: (value) => {
                config.error_color = value;
                window.elementSdk.setConfig({ error_color: value });
              }
            },
            {
              get: () => config.warning_color || defaultConfig.warning_color,
              set: (value) => {
                config.warning_color = value;
                window.elementSdk.setConfig({ warning_color: value });
              }
            },
            {
              get: () => config.success_color || defaultConfig.success_color,
              set: (value) => {
                config.success_color = value;
                window.elementSdk.setConfig({ success_color: value });
              }
            }
          ],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
          ['app_title', config.app_title || defaultConfig.app_title],
          ['judge_info', config.judge_info || defaultConfig.judge_info],
          ['current_case_header', config.current_case_header || defaultConfig.current_case_header],
          ['case_number', config.case_number || defaultConfig.case_number],
          ['petitioner_name', config.petitioner_name || defaultConfig.petitioner_name],
          ['control_header', config.control_header || defaultConfig.control_header],
          ['ripple_header', config.ripple_header || defaultConfig.ripple_header],
          ['confirm_button', config.confirm_button || defaultConfig.confirm_button],
          ['cancel_button', config.cancel_button || defaultConfig.cancel_button]
        ])
      });
    }

    // Time tracking
    const startTime = new Date();
    startTime.setHours(10, 0, 0, 0);
    
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
      document.getElementById('currentTime').textContent = `${displayHours}:${displayMinutes} ${ampm}`;
      document.getElementById('currentActualTime').textContent = `${displayHours}:${displayMinutes} ${ampm}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Update elapsed time
    let elapsedMinutes = 85;
    setInterval(() => {
      elapsedMinutes++;
      document.getElementById('elapsedMinutes').textContent = elapsedMinutes;
      document.getElementById('overrunMinutes').textContent = '+' + (elapsedMinutes - 30);
      
      const percentage = Math.round((elapsedMinutes / 30) * 100);
      document.getElementById('progressLabel').textContent = percentage + '%';
    }, 60000);

    // Initialize progress bar
    setTimeout(() => {
      document.getElementById('progressBar').style.width = '283%';
    }, 100);

    // Radio button selection
    let selectedMinutes = 10;
    
    document.querySelectorAll('.radio-option').forEach(option => {
      option.addEventListener('click', function() {
        document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        selectedMinutes = parseInt(this.dataset.minutes);
        updateRipplePreview(selectedMinutes);
      });
    });

    function updateRipplePreview(minutes) {
      const case3BaseTime = new Date();
      case3BaseTime.setHours(11, 40, 0, 0);
      const case3NewTime = new Date(case3BaseTime.getTime() + minutes * 60000);
      
      const case4BaseTime = new Date();
      case4BaseTime.setHours(12, 35, 0, 0);
      const case4NewTime = new Date(case4BaseTime.getTime() + minutes * 60000);

      const formatTime = (date) => {
        const hours = date.getHours();
        const mins = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMins = mins < 10 ? '0' + mins : mins;
        return `${displayHours}:${displayMins} ${ampm}`;
      };

      document.getElementById('case3Time').textContent = formatTime(case3NewTime);
      document.getElementById('case4Time').textContent = formatTime(case4NewTime);

      const label = minutes === 90 ? 'more than 1 hour' : minutes === 60 ? '1 hour' : `${minutes} minutes`;
      
      document.getElementById('ripplePreview').innerHTML = `
        If you select <strong>'${label}'</strong>:<br>
        • Case 3 shifts to <strong>${formatTime(case3NewTime)}</strong> (+${minutes} min)<br>
        • Case 4 shifts to <strong>${formatTime(case4NewTime)}</strong> (+${minutes} min)<br>
        • All advocates notified via WhatsApp
      `;
    }

    // Toast notification
    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }

    // Action handlers
    function confirmExtension() {
      const label = selectedMinutes === 90 ? 'more than 1 hour' : selectedMinutes === 60 ? '1 hour' : `${selectedMinutes} minutes`;
      showToast(`✓ Extension of ${label} confirmed! All advocates notified via WhatsApp.`);
      
      // Animate notification
      setTimeout(() => {
        showToast('📱 WhatsApp notifications sent to 8 advocates');
      }, 1500);
    }

    function cancelCase() {
      showToast('⚠️ Current case will be marked as complete. Proceeding to next case.');
    }

    // Initialize ripple preview
    updateRipplePreview(10);