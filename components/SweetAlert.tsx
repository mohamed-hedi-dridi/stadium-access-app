import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export interface SweetAlertProps {
  visible: boolean;
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  allowOutsideClick?: boolean;
  showCloseButton?: boolean;
}

const SweetAlert: React.FC<SweetAlertProps> = ({
  visible,
  title = 'Titre',
  text = 'Message',
  icon = 'info',
  showCancelButton = false,
  confirmButtonText = 'OK',
  cancelButtonText = 'Annuler',
  confirmButtonColor = '#3085d6',
  cancelButtonColor = '#d33',
  onConfirm,
  onCancel,
  onClose,
  allowOutsideClick = true,
  showCloseButton = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconConfig = () => {
    switch (icon) {
      case 'success':
        return {
          name: 'checkmark-circle' as const,
          color: '#27ae60',
          backgroundColor: '#d5f4e6',
        };
      case 'error':
        return {
          name: 'close-circle' as const,
          color: '#e74c3c',
          backgroundColor: '#fadbd8',
        };
      case 'warning':
        return {
          name: 'warning' as const,
          color: '#f39c12',
          backgroundColor: '#fef9e7',
        };
      case 'info':
        return {
          name: 'information-circle' as const,
          color: '#3498db',
          backgroundColor: '#d6eaf8',
        };
      case 'question':
        return {
          name: 'help-circle' as const,
          color: '#9b59b6',
          backgroundColor: '#e8daef',
        };
      default:
        return {
          name: 'information-circle' as const,
          color: '#3498db',
          backgroundColor: '#d6eaf8',
        };
    }
  };

  const iconConfig = getIconConfig();

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleBackdropPress = () => {
    if (allowOutsideClick) {
      onClose?.();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleBackdropPress}
        >
          <Animated.View
            style={[
              styles.alertContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} style={styles.alertContent}>
              {showCloseButton && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              )}

              <View style={[styles.iconContainer, { backgroundColor: iconConfig.backgroundColor }]}>
                <Ionicons name={iconConfig.name} size={60} color={iconConfig.color} />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.text}>{text}</Text>

              <View style={styles.buttonContainer}>
                {showCancelButton && (
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton, { backgroundColor: cancelButtonColor }]}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton, { backgroundColor: confirmButtonColor }]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  alertContent: {
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    // backgroundColor will be set dynamically
  },
  cancelButton: {
    // backgroundColor will be set dynamically
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SweetAlert;
