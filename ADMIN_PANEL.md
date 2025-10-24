# Admin Panel Documentation

## Overview

The admin panel provides a comprehensive management interface for course creators and administrators. It features production-grade authentication using Supabase and full course management capabilities.

## Authentication

### Supabase Authentication

The admin panel uses Supabase for authentication instead of the previous cookie-based approach. Users must have either `ADMIN` or `INSTRUCTOR` roles to access the panel.

### Access Requirements

1. Users must be authenticated with Supabase
2. Users must have `ADMIN` or `INSTRUCTOR` role in the database
3. Access is granted through the `/admin/signin` page

## Features

### Dashboard
- Overview of system statistics
- Recent courses created
- Recent enrollments
- Quick actions for common tasks

### Course Management
- Create, edit, and delete courses
- Manage course sections and lessons
- Add YouTube or other video content
- Publish/unpublish lessons

### User Management (Admin only)
- View all users in the system
- See user roles and activity
- Monitor enrollment statistics

### System Overview (Admin only)
- Platform status information
- System statistics and metrics

## Navigation Structure

```
Admin Panel
├── Dashboard (/admin)
├── Courses (/admin/courses)
│   ├── View all courses
│   ├── Create new course
│   ├── Edit course details
│   ├── Manage sections
│   └── Manage lessons
├── Users (Admin only) (/admin/users)
└── Settings (/admin/settings)
    └── System (Admin only) (/admin/system)
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Authenticate admin user
- `GET /api/admin/check-role` - Check user role

### Courses
- `GET /api/admin/courses/[slug]` - Get course details
- `PUT /api/admin/courses/[slug]` - Update course
- `DELETE /api/admin/courses/[slug]` - Delete course

### Sections
- `POST /api/admin/courses/[slug]/sections` - Create section

### Lessons
- `POST /api/admin/courses/[slug]/lessons` - Create lesson
- `GET /api/admin/courses/[slug]/lessons/[lessonId]` - Get lesson details
- `PUT /api/admin/courses/[slug]/lessons/[lessonId]` - Update lesson
- `DELETE /api/admin/courses/[slug]/lessons/[lessonId]` - Delete lesson

## Role-Based Access Control

### Instructor
- Can create and manage their own courses
- Can view dashboard and basic statistics
- Cannot access user management or system settings

### Admin
- Has all instructor permissions
- Can manage all courses in the system
- Can access user management
- Can view system overview and settings

## Security

- All admin routes are protected
- Role verification happens both in middleware and page components
- Supabase session management
- Proper error handling and user feedback

## UI/UX Improvements

- Responsive design for all screen sizes
- Clear navigation structure
- Consistent styling with the main application
- Loading states and error handling
- Intuitive forms for content creation