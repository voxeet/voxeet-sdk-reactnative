package io.dolby.sdk.reactnative.utils

import android.util.Log
import com.voxeet.promise.PromiseInOut
import com.voxeet.promise.solve.ThenPromise
import com.voxeet.promise.solve.ThenValue
import com.voxeet.promise.solve.ThenVoid

typealias VoxeetPromise<T> = com.voxeet.promise.Promise<T>
typealias ReactPromise = com.facebook.react.bridge.Promise

/**
 * Provide extension methods that simplify:
 * <p>- creation of [VoxeetPromise] from Java callable
 * <p>- joining [VoxeetPromise]'s and [ReactPromise]'s</p>
 */
object Promises {

    private val TAG = Promises.javaClass.simpleName

    @JvmStatic
    fun <T> promise(
            callable: () -> T?,
            nullErrorMessage: () -> String = { "Required value is null" }
    ): VoxeetPromise<T> {
        return VoxeetPromise { solver ->
            try {
                callable.invoke()?.let {
                    solver.resolve(it)
                } ?: solver.reject(Exception(nullErrorMessage()))
            } catch (cause: Exception) {
                Log.w(TAG, cause.message, cause)
                solver.reject(cause)
            }
        }
    }

    @JvmStatic
    fun <T> promise(value: T?, nullErrorMessage: () -> String = { "Required value is null" }): VoxeetPromise<T> {
        return value?.let { VoxeetPromise.resolve(value) }
                ?: VoxeetPromise.reject(Exception(nullErrorMessage()))
    }

    fun <T> VoxeetPromise<T?>.rejectIfNull(
            promise: ReactPromise,
            nullErrorMessage: () -> String = { "Required value is null" }
    ): PromiseInOut<T?, T>? =
            then(ThenValue { value ->
                value ?: run {
                    promise.reject(Exception(nullErrorMessage()))
                    null
                }
            })

    fun <T, R> VoxeetPromise<T>.thenValue(thenValue: ThenValue<T, R>): PromiseInOut<T, R> = then(thenValue)

    fun <T, R, K> PromiseInOut<T, R>.thenValue(thenValue: ThenValue<R, K>): PromiseInOut<R, K> = then(thenValue)

    fun <T, R> VoxeetPromise<T>.thenPromise(thenPromise: ThenPromise<T, R>): PromiseInOut<T, R> = then(thenPromise)

    fun <T, R, K> PromiseInOut<T, R>.thenPromise(thenPromise: ThenPromise<R, K>): PromiseInOut<R, K> = then(thenPromise)

    fun <T> VoxeetPromise<T>.forward(promise: ReactPromise, ignoreReturnType: Boolean = false) =
            then(ThenVoid { result ->
                if (ignoreReturnType) promise.resolve(null) else promise.resolve(result)
            }).error {
                Log.d(TAG, "Dispatch error", it)
                promise.reject(it)
            }

    fun <T, R> PromiseInOut<T, R>.forward(promise: ReactPromise, ignoreReturnType: Boolean = false) =
            then<Void>(ThenVoid { result ->
                if (ignoreReturnType) promise.resolve(null) else promise.resolve(result)
            }).error {
                Log.d(TAG, "Dispatch error", it)
                promise.reject(it)
            }

    fun Any?.forwardOptionalValue(promise: ReactPromise, errorMessage: () -> String) {
        this?.let(promise::resolve) ?: promise.reject(Exception(errorMessage()))
    }
}