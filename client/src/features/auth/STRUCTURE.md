# Auth Module Structure

## Overview
The auth module is organized for **maximum reusability, clarity, and maintainability**.

```
auth/
├── components/
│   ├── shared/                    # Reusable components
│   │   ├── FormField.jsx         # Text input wrapper
│   │   ├── PasswordInput.jsx      # Password input with toggle
│   │   ├── FileUpload.jsx         # File upload with preview
│   │   ├── StepProgress.jsx       # Multi-step progress bar
│   │   └── index.js              # Barrel export
│   ├── layouts/                   # Layout wrappers
│   │   ├── AuthLayout.jsx        # Auth page layout
│   │   ├── FormLayout.jsx        # Form page layout
│   │   └── index.js              # Barrel export
│   ├── forms/                     # Form components (WIP)
│   ├── steps/                     # Step components (WIP)
│   └── index.js                  # Main barrel export
├── pages/                         # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ProfessionalRegister.jsx
│   ├── ForgotPassword.jsx
│   ├── OTPVerify.jsx
│   └── index.js
├── context/                       # State management
├── hooks/                         # Custom hooks
├── services/                      # API services
├── store/                         # Redux store
└── utils/                         # Utility functions
```

## Component Reusability

### Shared Components

#### 1. **FormField**
Generic text input component used across all forms.

```jsx
import { FormField } from '@/features/auth/components';

<FormField
  label="Full Name"
  name="fullName"
  value={formData.fullName}
  onChange={handleChange}
  icon={User}
  placeholder="John Doe"
/>
```

#### 2. **PasswordInput**
Password field with show/hide toggle.

```jsx
import { PasswordInput } from '@/features/auth/components';

<PasswordInput
  label="Password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  required
/>
```

#### 3. **FileUpload**
File input with image preview.

```jsx
import { FileUpload } from '@/features/auth/components';

<FileUpload
  label="Profile Photo"
  name="profilePhoto"
  onChange={handleFileChange}
  preview={previews.profilePhoto}
  accept="image/*"
/>
```

#### 4. **StepProgress**
Multi-step form progress indicator.

```jsx
import { StepProgress } from '@/features/auth/components';

<StepProgress 
  steps={STEPS} 
  currentStep={currentStep} 
/>
```

### Layout Components

#### 1. **AuthLayout**
Wrapper for authentication pages (Login, Register, Forgot Password).

```jsx
import { AuthLayout } from '@/features/auth/components';

<AuthLayout 
  title="Sign In"
  subtitle="Welcome back to JobJiffy"
>
  {/* Form content */}
</AuthLayout>
```

#### 2. **FormLayout**
Wrapper for multi-step forms (Professional Register).

```jsx
import { FormLayout } from '@/features/auth/components';

<FormLayout 
  title="Professional Registration"
  subtitle="Join JobJiffy as a service professional"
>
  {/* Form content */}
</FormLayout>
```

## Usage Example

### Before (Without Proper Structure)
```jsx
// Pages were monolithic, hard to reuse components
import { AuthLayout, PasswordInput } from '@/features/auth/components';

export default function Login() {
  const [password, setPassword] = useState('');
  
  return (
    <div>
      {/* Inline styling and logic */}
    </div>
  );
}
```

### After (With Organized Structure)
```jsx
import { FormLayout, FormField, PasswordInput, StepProgress } from '@/features/auth/components';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <AuthLayout title="Sign In" subtitle="Welcome back">
      <FormField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        icon={Mail}
      />
      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
    </AuthLayout>
  );
}
```

## Benefits

✅ **Reusability** - FormField, PasswordInput used across all forms  
✅ **Consistency** - Same styling, behavior across forms  
✅ **Maintainability** - Changes in FormField apply everywhere  
✅ **Scalability** - Easy to add new forms with existing components  
✅ **Clear Flow** - Components → Forms → Pages hierarchy  
✅ **Clean Exports** - Barrel exports for easy imports  

## Migration Plan

1. ✅ Create shared components (FormField, PasswordInput, FileUpload, StepProgress)
2. ✅ Create layout components (AuthLayout, FormLayout)
3. 🔄 Refactor existing forms to use shared components
4. 🔄 Extract step components for multi-step forms
5. 🔄 Update all pages to use new structure
6. ✅ Update exports and documentation

## Next Steps

- [ ] Migrate LoginForm to use FormField, PasswordInput
- [ ] Migrate RegisterForm to use FormField, PasswordInput
- [ ] Extract ProfessionalRegister steps into Step components
- [ ] Create forms/LoginForm.jsx wrapper
- [ ] Create forms/RegisterForm.jsx wrapper
- [ ] Update all imports in pages/
