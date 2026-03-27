/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { updateProfile } from '@/actions/profile'
import { useLanguage } from "@/components/LanguageProvider";
import { createClient } from '@/lib/supabase/client'
import { FormField } from '@/components/FormField'
import { StatusNotice } from '@/components/StatusNotice'
import { SurfacePanel } from '@/components/SurfacePanel'
import { getDashboardCopy } from "@/features/dashboard/lib/dashboardCopy";
import { antinoou } from '@/lib/fonts'
import type { Tables } from '@/types/supabase'

export function ProfileForm({
  profile,
  embedded = false,
}: {
  profile: Tables<'profiles'>
  embedded?: boolean
}) {
  const { language } = useLanguage()
  const copy = getDashboardCopy(language)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url)
  const [pendingAvatarStoragePath, setPendingAvatarStoragePath] = useState<string | null>(null)
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setStatus(null)
      setIsUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(copy.profile.selectImageError)
      }

      if (!supabase) {
        throw new Error(copy.profile.uploadUnavailableError)
      }

      const file = event.target.files[0]

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      }
      
      setStatus({ message: copy.profile.compressingImage, type: 'success' })
      const compressedFile = await imageCompression(file, options)
      setStatus({ message: copy.profile.uploadingImage, type: 'success' })

      const fileExt = file.name.split('.').pop() || 'jpeg'
      const filePath = `${profile.id}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      setPendingAvatarStoragePath(filePath)
      
      // Auto-clear the "Uploading to server..." success message
      setTimeout(() => setStatus(null), 3000)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : copy.profile.uploadUnknownError
      setStatus({ message: errorMessage, type: 'error' })
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(formData: FormData) {
    setStatus(null)
    if (pendingAvatarStoragePath && avatarUrl) {
      formData.set('avatar_url', avatarUrl)
    }
    
    const result = await updateProfile(formData)
    if (result.success) {
      if (supabase && pendingAvatarStoragePath) {
        try {
          const { data: existingFiles, error: listError } = await supabase.storage
            .from('avatars')
            .list(profile.id, { limit: 100 })

          if (listError) {
            throw listError
          }

          const staleFilePaths = (existingFiles ?? [])
            .map((existingFile) => `${profile.id}/${existingFile.name}`)
            .filter((filePath) => filePath !== pendingAvatarStoragePath)

          if (staleFilePaths.length > 0) {
            const { error: removeError } = await supabase.storage
              .from('avatars')
              .remove(staleFilePaths)

            if (removeError) {
              throw removeError
            }
          }
        } catch (error) {
          console.warn('Failed to prune old avatars after profile update.', error)
        }
      }

      setPendingAvatarStoragePath(null)
      setStatus({ message: copy.profile.updatedSuccess, type: 'success' })
      setTimeout(() => setStatus(null), 3000)
    } else {
      setStatus({
        message: result.error || copy.profile.updateFailed,
        type: 'error',
      })
    }
  }

  const content = (
    <div className="flex flex-col items-start gap-8 md:flex-row">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-stone-100 shadow-sm dark:border-stone-700 dark:bg-stone-800">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={copy.profile.avatarAlt}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-stone-400 dark:text-stone-500">
              {copy.profile.noAvatar}
            </span>
          )}
        </div>
        <div>
          <label className="btn-secondary relative cursor-pointer px-4 py-2 text-xs" htmlFor="single">
            {isUploading ? copy.profile.uploadPending : copy.profile.uploadIdle}
          </label>
          <input
            style={{
              visibility: 'hidden',
              position: 'absolute',
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      <form action={handleSubmit} className="flex-1 w-full space-y-6 text-stone-800 dark:text-stone-200">
        <FormField htmlFor="full_name" label={copy.profile.fullNameLabel}>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className={`input-base ${antinoou.className} tracking-wide`}
            defaultValue={profile.full_name || ''}
            placeholder={copy.profile.fullNamePlaceholder}
          />
        </FormField>

        <FormField htmlFor="email" label={copy.profile.emailLabel}>
          <input
            id="email"
            type="email"
            className="input-base bg-stone-50 text-stone-500 dark:bg-stone-900"
            defaultValue={profile.email || ''}
            disabled
          />
          <p className="mt-1 text-xs text-stone-500">{copy.profile.emailHint}</p>
        </FormField>

        <button type="submit" className="btn-primary w-full px-8 md:w-auto" disabled={isUploading}>
          {copy.profile.saveChanges}
        </button>

        {status && (
          <StatusNotice tone={status.type} className="mt-4">
            {status.message}
          </StatusNotice>
        )}
      </form>
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <SurfacePanel rounded="3xl" className="p-6 md:p-8">
      <h3 className="mb-6 text-xl font-semibold text-stone-800 dark:text-stone-200">
        {copy.profile.sectionTitle}
      </h3>
      {content}
    </SurfacePanel>
  )
}
